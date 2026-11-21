import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import Cookies from 'js-cookie';
import userReducer, { deleteUserAvatar, login, logout, updateUser } from './userSlice';
import api from 'services/axios.service';

vi.mock('services/axios.service', () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

const user = { firstName: 'Alice', lastName: 'Tester', email: 'alice@example.com', avatarUrl: '', description: '', createdAt: new Date(), updatedAt: new Date() };

describe('account operations', () => {
    it('logs in, stores tokens, and fetches the profile with authorization', async () => {
        const store = configureStore({ reducer: userReducer });
        vi.mocked(api.post).mockResolvedValueOnce({ status: 200, data: { accessToken: 'access', refreshToken: 'refresh' } });
        vi.mocked(api.get).mockResolvedValueOnce({ data: user });
        await store.dispatch(login({ email: user.email, password: 'testpassword123' }));
        expect(store.getState().isAuthenticated).toBe(true);
        expect(store.getState().user.email).toBe(user.email);
        expect(api.get).toHaveBeenCalledWith('/user', { headers: { Authorization: 'Bearer access' } });
        expect(Cookies.get('refreshToken')).toBe('refresh');
    });

    it('keeps a valid empty user object after rejected credentials', async () => {
        const store = configureStore({ reducer: userReducer });
        vi.mocked(api.post).mockRejectedValueOnce({ isAxiosError: true, response: { status: 401 } });
        await store.dispatch(login({ email: user.email, password: 'wrong' }));
        expect(store.getState().isAuthenticated).toBe(false);
        expect(store.getState().user).toEqual({});
    });

    it('clears local credentials even when the logout request fails', async () => {
        const store = configureStore({ reducer: userReducer });
        Cookies.set('accessToken', 'access');
        Cookies.set('refreshToken', 'refresh');
        vi.mocked(api.post).mockRejectedValueOnce(new Error('Offline'));
        await store.dispatch(logout());
        expect(Cookies.get('accessToken')).toBeUndefined();
        expect(Cookies.get('refreshToken')).toBeUndefined();
        expect(store.getState().isAuthenticated).toBe(false);
    });

    it('preserves the current profile after a failed update', async () => {
        const initial = userReducer(undefined, { type: 'init' });
        const store = configureStore({ reducer: userReducer, preloadedState: { ...initial, user, isAuthenticated: true } });
        vi.mocked(api.patch).mockRejectedValueOnce({ isAxiosError: true, response: { status: 500 } });
        await store.dispatch(updateUser({ ...user, firstName: 'Changed' }));
        expect(store.getState().user.firstName).toBe('Alice');
        expect(store.getState().isAuthenticated).toBe(true);
    });

    it('deletes avatars using the actual backend route', async () => {
        const store = configureStore({ reducer: userReducer });
        Cookies.set('accessToken', 'access');
        vi.mocked(api.delete).mockResolvedValueOnce({ status: 200 });
        await store.dispatch(deleteUserAvatar('uploads/userAvatar/image.png'));
        expect(api.delete).toHaveBeenCalledWith('/user/userAvatar/image.png', { headers: { Authorization: 'Bearer access' } });
    });
});
