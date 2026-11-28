import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';

interface Call {
  url: string;
  method: string;
  withCredentials: boolean;
  hasAuthorizationHeader: boolean;
}

const calls: Call[] = [];
let refreshStatus = 200;
// Pending 403 "Access denied" answers by url, used to simulate an expired access cookie.
let denials: Record<string, { message: string; times: number }> = {};

// Both axios instances created by the service inherit this fake network layer.
axios.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
  calls.push({
    url: config.url ?? '',
    method: config.method ?? '',
    withCredentials: !!config.withCredentials,
    hasAuthorizationHeader: !!config.headers.Authorization,
  });
  const respond = (status: number, data: unknown) => {
    const response = { data, status, statusText: '', headers: {}, config };
    if (status >= 400) {
      throw new AxiosError('failed', 'ERR', config, null, response);
    }
    return response;
  };

  if (config.url === '/user/refreshAccessToken') {
    return respond(refreshStatus, { message: 'refreshed' });
  }
  const denial = denials[config.url ?? ''];
  if (denial && denial.times > 0) {
    denial.times -= 1;
    return respond(403, { message: denial.message });
  }
  return respond(200, { ok: true });
};

const { default: api, SESSION_EXPIRED_EVENT } = await import('./axios.service');

const refreshCalls = () =>
  calls.filter((call) => call.url === '/user/refreshAccessToken');

let sessionExpiredEvents = 0;
window.addEventListener(SESSION_EXPIRED_EVENT, () => sessionExpiredEvents++);

beforeEach(() => {
  calls.length = 0;
  refreshStatus = 200;
  denials = {};
  sessionExpiredEvents = 0;
});

describe('cookie based session', () => {
  it('sends the browser cookies and never attaches a token itself', async () => {
    await api.get('/get-posts');

    expect(calls).toHaveLength(1);
    expect(calls[0].withCredentials).toBe(true);
    expect(calls[0].hasAuthorizationHeader).toBe(false);
  });

  it('renews the session once and repeats the request when the access cookie expired', async () => {
    denials['/get-posts'] = { message: 'Access denied', times: 1 };

    const response = await api.get('/get-posts');

    expect(response.status).toBe(200);
    expect(refreshCalls()).toHaveLength(1);
    expect(refreshCalls()[0].withCredentials).toBe(true);
    expect(calls.filter((call) => call.url === '/get-posts')).toHaveLength(2);
    expect(sessionExpiredEvents).toBe(0);
  });

  it('shares one renewal between simultaneous requests', async () => {
    denials['/get-posts'] = { message: 'Access denied', times: 1 };
    denials['/get-post/1'] = { message: 'Access denied', times: 1 };

    await Promise.all([api.get('/get-posts'), api.get('/get-post/1')]);

    expect(refreshCalls()).toHaveLength(1);
  });

  it('announces the end of the session only when the refresh token is rejected', async () => {
    denials['/get-posts'] = { message: 'Access denied', times: 5 };
    refreshStatus = 401;

    await expect(api.get('/get-posts')).rejects.toBeTruthy();

    expect(sessionExpiredEvents).toBe(1);
  });

  it('keeps the session when renewing fails because of a server error', async () => {
    denials['/get-posts'] = { message: 'Access denied', times: 5 };
    refreshStatus = 500;

    await expect(api.get('/get-posts')).rejects.toBeTruthy();

    expect(sessionExpiredEvents).toBe(0);
  });

  it('does not renew the session for other authorization errors', async () => {
    denials['/post/postImage/a.png'] = {
      message: 'You can only delete your own files.',
      times: 1,
    };

    await expect(api.delete('/post/postImage/a.png')).rejects.toBeTruthy();

    expect(refreshCalls()).toHaveLength(0);
  });

  it('does not try to renew the session during login', async () => {
    denials['/user/login'] = { message: 'Access denied', times: 1 };

    await expect(api.post('/user/login')).rejects.toBeTruthy();

    expect(refreshCalls()).toHaveLength(0);
  });
});
