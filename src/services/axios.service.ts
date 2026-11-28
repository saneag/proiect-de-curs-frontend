import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/hf';

// Dispatched when the API refuses to renew the session, so the app can show the login page.
export const SESSION_EXPIRED_EVENT = 'session-expired';

// The session lives in HttpOnly cookies that the browser attaches to every request.
// Page scripts never see the tokens, so a script injected into the page cannot steal them.
const instance = axios.create({ baseURL, withCredentials: true });
// Separate client so renewing the session never goes through the interceptor below.
const refreshClient = axios.create({ baseURL, withCredentials: true });

const isAuthRequest = (url = '') =>
  /\/user\/(login|register|refreshAccessToken|logout)$/.test(url);

let pendingRefresh: Promise<boolean> | null = null;

/** Renews the session once, even when several requests need it at the same time. */
function refreshSession(): Promise<boolean> {
  pendingRefresh ??= refreshClient
    .post('/user/refreshAccessToken')
    .then(() => true)
    .catch((error) => {
      // Only a rejected refresh token ends the session; a network error does not.
      if (isAxiosError(error) && error.response?.status === 401) {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }
      return false;
    })
    .finally(() => {
      pendingRefresh = null;
    });
  return pendingRefresh;
}

// The access cookie lasts 15 minutes. When the API reports it as rejected, renew the
// session in the background and repeat the request once.
instance.interceptors.response.use(undefined, async (error) => {
  const config = error.config as
    (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
  const status = error.response?.status;
  const accessDenied =
    (status === 401 || status === 403) &&
    error.response?.data?.message === 'Access denied';

  if (
    !config ||
    config._retried ||
    !accessDenied ||
    isAuthRequest(config.url)
  ) {
    return Promise.reject(error);
  }

  config._retried = true;
  return (await refreshSession()) ? instance(config) : Promise.reject(error);
});

export default instance;
