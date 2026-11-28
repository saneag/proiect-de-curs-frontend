import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Mail, SquarePen } from 'lucide-react';

import { useAppSelector } from 'redux/store';
import { Components } from 'components';

import EditProfileDialog from './EditProfileDialog';

const UserProfile = () => {
  const user = useAppSelector((state) => state.userReducer.user);
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);

  return (
    <div className="mx-auto my-6 flex w-full max-w-2xl flex-col gap-8 px-4">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-28 bg-linear-to-r from-blue-700 to-blue-500" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="rounded-full bg-white p-1">
              <Components.ImageRenderer
                imageUrl={user.avatarUrl}
                type="userAvatar"
                alt="Your avatar"
                className="size-24 rounded-full object-cover"
              />
            </div>
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
              onClick={() => setIsEditOpen(true)}
            >
              <SquarePen className="size-4" />
              Edit profile
            </button>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Mail className="size-4" />
            {user.email}
          </p>
          <p className="mt-4 whitespace-pre-line text-gray-700">
            {user.description || (
              <button
                type="button"
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setIsEditOpen(true)}
              >
                Add a short bio
              </button>
            )}
          </p>
        </div>
      </section>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">My posts</h2>
        <Components.PostList email={user.email} className="max-w-none">
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
