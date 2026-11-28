import React from 'react';
import { PostContext } from '../index';
import { Components } from '../../../index';
import { convertDate } from '../../../../utils/convertDate';
import { Link } from 'react-router-dom';

const CardComments = () => {
  const { userPost } = React.useContext(PostContext);

  return (
    <div
      className={`${userPost.numberOfComments > 0 && 'border-t border-gray-200'} ${
        userPost.numberOfComments > 3 &&
        'h-60 scrollbar overflow-y-scroll shadow-inner'
      }`}
    >
      {userPost.comments.map((comment, index) => (
        <div
          key={index}
          className="flex gap-3 border-b border-gray-200 px-4 py-3 last:border-b-0"
        >
          <Link
            to={`/userProfile/${comment.creator.email}`}
            className="shrink-0"
          >
            <Components.ImageRenderer
              imageUrl={comment.creator.avatarUrl}
              type={'userAvatar'}
              alt={'userAvatar'}
              className={'size-9 rounded-full object-cover'}
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <Link
                to={`/userProfile/${comment.creator.email}`}
                className="font-semibold text-gray-900 hover:underline"
              >
                {comment.creator.firstName} {comment.creator.lastName}
              </Link>
              <span className="text-sm text-gray-600">
                {convertDate(comment.createdAt)}
              </span>
            </div>
            <span className="wrap-break-word whitespace-pre-wrap text-gray-900">
              {comment.content}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardComments;
