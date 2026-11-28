import { Mail, SquarePen } from 'lucide-react';

import { Components } from 'components';
import { type IUserResponse } from 'shared/interfaces/IUser';

interface IProps {
  user: Pick<
    IUserResponse,
    'firstName' | 'lastName' | 'email' | 'avatarUrl' | 'description'
  >;
  // Passing this makes the profile editable; viewers get a read-only card.
  onEdit?: () => void;
}

const ProfileHeader = ({ user, onEdit }: IProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-28 bg-linear-to-r from-blue-700 to-blue-500" />
      <div className="relative px-6 pb-6">
        <div className="-mt-12 flex items-end justify-between">
          <div className="rounded-full bg-white p-1">
            <Components.ImageRenderer
              imageUrl={user.avatarUrl}
              type="userAvatar"
              alt={`${user.firstName} ${user.lastName}`}
              className="size-24 rounded-full object-cover"
            />
          </div>
          {onEdit && (
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
              onClick={onEdit}
            >
              <SquarePen className="size-4" />
              Edit profile
            </button>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <Mail className="size-4" />
          {user.email}
        </p>
        <p className="mt-4 whitespace-pre-line text-gray-700">
          {user.description ||
            (onEdit ? (
              <button
                type="button"
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={onEdit}
              >
                Add a short bio
              </button>
            ) : (
              <span className="text-gray-500">No bio yet.</span>
            ))}
        </p>
      </div>
    </section>
  );
};

export default ProfileHeader;
