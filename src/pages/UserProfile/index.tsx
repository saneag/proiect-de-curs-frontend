import React from 'react';
import { AnimatePresence } from 'framer-motion';

import { useAppSelector } from 'redux/store';
import { Components } from 'components';

import EditProfileDialog from './EditProfileDialog';
import ProfileHeader from './ProfileHeader';

const UserProfile = () => {
  const user = useAppSelector((state) => state.userReducer.user);
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);

  return (
    <div className="mx-auto my-6 flex w-full max-w-2xl flex-col gap-8 px-4">
      <ProfileHeader user={user} onEdit={() => setIsEditOpen(true)} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">My posts</h2>
        <Components.PostList creatorId={user.id} className="max-w-none">
          <Components.AddPost />
        </Components.PostList>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <EditProfileDialog onClose={() => setIsEditOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
