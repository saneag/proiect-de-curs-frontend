import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { Pages } from './pages';

export const useRoutes = (isAuthenticated: boolean) => {
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Pages.Home />} />
        <Route path="/groups" element={<Pages.Groups />} />
        <Route path="/userProfile" element={<Pages.UserProfile />} />
        <Route path="/userProfile/:id" element={<Pages.UserProfileAsGuest />} />
        <Route path="/myPosts/:id" element={<Pages.MyPosts />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Pages.NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Pages.Login />} />
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
            state={{
              from: `${location.pathname}${location.search}${location.hash}`,
            }}
          />
        }
      />
    </Routes>
  );
};
