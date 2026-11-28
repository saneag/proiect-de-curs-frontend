import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { getUserById } from 'redux/slices/userSlice';
import { Components } from 'components';

import NotFound from '../NotFound';
import ProfileHeader from './ProfileHeader';

const UserProfileAsGuest = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const me = useAppSelector((state) => state.userReducer.user);
  const visitedUser = useAppSelector((state) => state.userReducer.visitedUser);
  const [loadedId, setLoadedId] = React.useState<string>();

  React.useEffect(() => {
    if (!id || id === me.id) return;
    dispatch(getUserById(id)).finally(() => setLoadedId(id));
  }, [dispatch, id, me.id]);

  if (id === me.id) return <Navigate to="/userProfile" replace />;
  if (loadedId !== id) return null;
  if (visitedUser.id !== id) return <NotFound />;

  return (
    <div className="mx-auto my-6 flex w-full max-w-2xl flex-col gap-8 px-4">
      <ProfileHeader user={visitedUser} />
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Posts</h2>
        <Components.PostList
          creatorId={visitedUser.id}
          className="max-w-none"
        />
      </div>
    </div>
  );
};

export default UserProfileAsGuest;
