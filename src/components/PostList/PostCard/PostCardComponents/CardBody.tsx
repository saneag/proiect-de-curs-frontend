import React from 'react';
import { Components } from 'components';
import { PostContext } from '../index';
import { sanitizePostHtml } from 'utils/sanitizePostHtml';

const CardBody = () => {
  const { userPost } = React.useContext(PostContext);

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
      <h3 className="text-2xl font-bold wrap-break-word text-gray-900">
        {userPost.title}
      </h3>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizePostHtml(userPost.content),
        }}
        className="max-h-100 scrollbar overflow-y-auto text-lg wrap-break-word text-gray-800 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-6"
      />
      {userPost.image && (
        <Components.ImageRenderer
          imageUrl={userPost.image}
          alt={userPost.title}
          className="block max-h-144 w-full rounded-xl object-cover"
        />
      )}
    </div>
  );
};

export default CardBody;
