import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import userReducer, {
  deleteUserAvatar,
  login,
  logout,
  sessionExpired,
  updateUser,
} from './userSlice';
import api from 'services/axios.service';

vi.mock('services/axios.service', () => ({
  default: { post: vi.fn(), get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const user = {
  id: 'user-1',
  firstName: 'Alice',
  lastName: 'Tester',
  email: 'alice@example.com',
  avatarUrl: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('account operations', () => {
  it('logs in and loads the profile without handling any token', async () => {
    const store = configureStore({ reducer: userReducer });
    vi.mocked(api.post).mockResolvedValueOnce({
      status: 200,
      data: { message: 'Login successful' },
    });
    vi.mocked(api.get).mockResolvedValueOnce({ data: user });
    await store.dispatch(
      login({ email: user.email, password: 'testpassword123' }),
    );
    expect(store.getState().isAuthenticated).toBe(true);
    expect(store.getState().user.email).toBe(user.email);
    // The session cookies are set by the API; the request carries no token.
    expect(api.get).toHaveBeenCalledWith('/user');
    expect(document.cookie).toBe('');
    expect(JSON.stringify(localStorage)).not.toMatch(/token/i);
  });

  it('keeps a valid empty user object after rejected credentials', async () => {
    const store = configureStore({ reducer: userReducer });
    vi.mocked(api.post).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 401 },
    });
    await store.dispatch(login({ email: user.email, password: 'wrong' }));
    expect(store.getState().isAuthenticated).toBe(false);
    expect(store.getState().user).toEqual({});
  });

  it('signs out locally even when the logout request fails', async () => {
    const initial = userReducer(undefined, { type: 'init' });
    const store = configureStore({
      reducer: userReducer,
      preloadedState: { ...initial, user, isAuthenticated: true },
    });
    vi.mocked(api.post).mockRejectedValueOnce(new Error('Offline'));
    await store.dispatch(logout());
    expect(api.post).toHaveBeenCalledWith('/user/logout');
    expect(store.getState().isAuthenticated).toBe(false);
    expect(store.getState().user).toEqual({});
  });

  it('returns to the login page when the session expires', () => {
    const initial = userReducer(undefined, { type: 'init' });
    const state = userReducer(
      { ...initial, user, isAuthenticated: true },
      sessionExpired(),
    );
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({});
  });

  it('preserves the current profile after a failed update', async () => {
    const initial = userReducer(undefined, { type: 'init' });
    const store = configureStore({
      reducer: userReducer,
      preloadedState: { ...initial, user, isAuthenticated: true },
    });
    vi.mocked(api.patch).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500 },
    });
    await store.dispatch(updateUser({ ...user, firstName: 'Changed' }));
    expect(store.getState().user.firstName).toBe('Alice');
    expect(store.getState().isAuthenticated).toBe(true);
  });

  it('deletes avatars using the actual backend route', async () => {
    const store = configureStore({ reducer: userReducer });
    vi.mocked(api.delete).mockResolvedValueOnce({ status: 200 });
    await store.dispatch(deleteUserAvatar('uploads/userAvatar/image.png'));
    expect(api.delete).toHaveBeenCalledWith('/user/userAvatar/image.png');
  });
});
