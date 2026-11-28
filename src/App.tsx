import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from './redux/store';

import { Components } from './components';
import { useRoutes } from './Routes';

import { getUser, sessionExpired } from './redux/slices/userSlice';
import { SESSION_EXPIRED_EVENT } from './services/axios.service';

function App(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.userReducer.userStatus);
  const [isLoading, setIsLoading] = React.useState(true);

  const isAuthenticated = useAppSelector(
    (state) => state.userReducer.isAuthenticated,
  );

  React.useEffect(() => {
    dispatch(getUser()).finally(() => setIsLoading(false));
  }, [dispatch]);

  // Back to the login page when the API can no longer renew the session.
  React.useEffect(() => {
    const handleExpired = () => dispatch(sessionExpired());
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () =>
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [dispatch]);

  const routes = useRoutes(isAuthenticated);

  if (status >= 500) {
    return <Components.Loading isServerError={true} />;
  }

  if (isLoading) return <Components.Loading isServerError={false} />;

  return (
    <div>
      <ToastContainer />
      {isAuthenticated && <Components.Header />}
      {routes}
    </div>
  );
}

export default App;
