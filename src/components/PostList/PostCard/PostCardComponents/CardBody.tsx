import React from 'react';
import { Components } from 'components';
import { PostContext } from '../index';
import { sanitizePostHtml } from 'utils/sanitizePostHtml';

const CardBody = () => {
  const { userPost } = React.useContext(PostContext);

  return (
    <div
      className={`flex flex-col gap-2 border-b-2 p-3 lg:flex-row ${
        !userPost.image && 'justify-center'
      }`}
    >
      <div
        className={`flex w-full items-center pl-3 ${
          userPost.image ? 'lg:w-5/12' : 'lg:w-8/12'
        } lg:p-0`}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: sanitizePostHtml(userPost.content),
          }}
          className="max-h-100 scrollbar w-full overflow-y-auto text-lg wrap-break-word [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-3 [&_blockquote]:text-gray-700 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
        ></span>
      </div>
      {userPost.image && (
        <div className="flex w-full items-center lg:w-7/12">
          <Components.ImageRenderer
            imageUrl={userPost.image}
            alt={''}
            className={'w-full rounded-2xl'}
          />
        </div>
      )}
    </div>
  );
};

export default CardBody;
