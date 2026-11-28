import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import userReducer from './redux/slices/userSlice';
import postReducer from './redux/slices/postSlice';
import api from './services/axios.service';

vi.mock('./services/axios.service', () => ({
  default: { post: vi.fn(), get: vi.fn() },
  SESSION_EXPIRED_EVENT: 'session-expired',
}));
vi.mock('./components', () => ({
  Components: {
    Header: () => <header>Navigation</header>,
    Loading: ({ isServerError }: { isServerError: boolean }) => (
      <div>{isServerError ? 'Server unavailable' : 'Loading session'}</div>
    ),
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
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </Provider>,
  );
}

describe('session restoration and routing', () => {
  it('opens login without a session and does not show a false image error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 403 },
    });
    renderApp('/userProfile');
    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(
      screen.queryByText('Error with image loading'),
    ).not.toBeInTheDocument();
  });

  it('finishes loading when the API rejects the session with HTTP 400', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 400 },
    });
    renderApp();
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  it('shows a server error if session restoration fails with HTTP 500', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500 },
    });
    renderApp();
    expect(await screen.findByText('Server unavailable')).toBeInTheDocument();
  });

  it('restores a session and opens an authenticated deep link', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 200,
      data: { email: 'user@example.com' },
    });
    renderApp('/userProfile');
    expect(await screen.findByText('Profile page')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    // The app never reads, stores or sends a token itself.
    expect(api.get).toHaveBeenCalledWith('/user');
    expect(document.cookie).toBe('');
    expect(JSON.stringify(localStorage)).not.toMatch(/token/i);
  });

  it('keeps the session when the API is briefly unreachable', async () => {
    vi.mocked(api.get)
      .mockRejectedValueOnce({ isAxiosError: true })
      .mockResolvedValueOnce({
        status: 200,
        data: { email: 'user@example.com' },
      });
    renderApp('/userProfile');
    expect(await screen.findByText('Profile page')).toBeInTheDocument();
  });

  it('returns to the login page when the session can no longer be renewed', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      status: 200,
      data: { email: 'user@example.com' },
    });
    renderApp('/userProfile');
    expect(await screen.findByText('Profile page')).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new Event('session-expired'));
    });
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});
