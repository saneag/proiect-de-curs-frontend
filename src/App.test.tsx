import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import App from './App';
import userReducer from './redux/slices/userSlice';
import postReducer from './redux/slices/postSlice';
import api from './services/axios.service';

vi.mock('./services/axios.service', () => ({ default: { post: vi.fn(), get: vi.fn() } }));
vi.mock('./components', () => ({
    Components: {
        Header: () => <header>Navigation</header>,
        Loading: ({ isServerError }: { isServerError: boolean }) =>
            <div>{isServerError ? 'Server unavailable' : 'Loading session'}</div>,
    },
}));
vi.mock('./pages', () => ({
    Pages: {
        Login: () => <div>Login page</div>,
        Home: () => <div>Home page</div>,
        Groups: () => <div>Groups page</div>,
        UserProfile: () => <div>Profile page</div>,
        UserProfileAsGuest: () => <div>Guest profile page</div>,
        MyPosts: () => <div>My posts page</div>,
    },
}));

function renderApp(url = '/') {
    const store = configureStore({ reducer: { userReducer, postReducer } });
    render(<Provider store={store}><MemoryRouter initialEntries={[url]}><App /></MemoryRouter></Provider>);
}

describe('session restoration and routing', () => {
    it('opens login without a token and does not show a false image error', async () => {
        renderApp('/userProfile');
        expect(await screen.findByText('Login page')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
        expect(screen.queryByText('Error with image loading')).not.toBeInTheDocument();
    });

    it('finishes loading when the API rejects a malformed session with HTTP 400', async () => {
        Cookies.set('refreshToken', 'invalid');
        vi.mocked(api.post).mockRejectedValueOnce({ isAxiosError: true, response: { status: 400 } });
        renderApp();
        expect(await screen.findByText('Login page')).toBeInTheDocument();
    });

    it('shows a server error if session restoration fails with HTTP 500', async () => {
        Cookies.set('refreshToken', 'session');
        vi.mocked(api.post).mockRejectedValueOnce({ isAxiosError: true, response: { status: 500 } });
        renderApp();
        expect(await screen.findByText('Server unavailable')).toBeInTheDocument();
    });

    it('restores a session and opens an authenticated deep link', async () => {
        Cookies.set('refreshToken', 'session');
        vi.mocked(api.post).mockResolvedValueOnce({ data: { accessToken: 'renewed' } });
        vi.mocked(api.get).mockResolvedValueOnce({ status: 200, data: { email: 'user@example.com' } });
        renderApp('/userProfile');
        expect(await screen.findByText('Profile page')).toBeInTheDocument();
        expect(screen.getByText('Navigation')).toBeInTheDocument();
        expect(Cookies.get('accessToken')).toBe('renewed');
    });
});
