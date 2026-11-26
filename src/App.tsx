import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from './redux/store';

import { Components } from './components';
import { useRoutes } from './Routes';

import { getUser } from './redux/slices/userSlice';

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
