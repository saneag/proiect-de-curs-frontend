import React from 'react';
import { Components } from 'components';
import EditButtons from '../EditButtons';
import { useAppSelector } from 'redux/store';
import { Link } from 'react-router-dom';
import { PostContext } from '../index';
import { convertDate } from 'utils/convertDate';

const CardHeader = () => {
  const user = useAppSelector((state) => state.userReducer.user);
  const { userPost } = React.useContext(PostContext);
  const profileLink = `/userProfile/${userPost.creator.email}`;

  const isEdited =
    new Date(userPost.updatedAt).getTime() -
      new Date(userPost.createdAt).getTime() >
    1000;

  return (
    <div className="flex items-center gap-3 px-4 pt-4">
      <Link to={profileLink} className="shrink-0">
        <Components.ImageRenderer
          imageUrl={userPost.creator.avatarUrl}
          type={'userAvatar'}
          alt={''}
          className="size-11 rounded-full object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <Link
          to={profileLink}
          className="max-w-full self-start truncate font-semibold text-gray-900 hover:underline"
        >
          {userPost.creator.firstName} {userPost.creator.lastName}
        </Link>
        <span className="text-sm text-gray-600">
          {convertDate(userPost.createdAt)}
          {isEdited && (
            <span
              className="ml-1.5 text-gray-500 italic"
              title={'Edited ' + convertDate(userPost.updatedAt)}
            >
              · Edited
            </span>
          )}
        </span>
      </div>
      {userPost.creatorId === user.id && (
        <div className="shrink-0">
          <EditButtons post={userPost} />
        </div>
      )}
    </div>
  );
};

export default CardHeader;
