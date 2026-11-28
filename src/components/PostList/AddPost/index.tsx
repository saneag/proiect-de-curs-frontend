import React from 'react';
import { SquarePen } from 'lucide-react';

import PostForm from './PostForm';
import { AnimatePresence } from 'framer-motion';

const AddPost = () => {
  const [isAddPostFormOpen, setIsAddPostFormOpen] =
    React.useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        aria-label="New post"
        className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-blue-700 px-4 font-medium text-white shadow-sm transition duration-150 hover:bg-blue-600 active:scale-95"
        onClick={() => setIsAddPostFormOpen(true)}
      >
        <SquarePen className="size-5 shrink-0" />
        <span className="max-sm:hidden">New post</span>
      </button>

      <AnimatePresence>
        {isAddPostFormOpen && (
          <PostForm setIsAddPostFormOpen={setIsAddPostFormOpen} />
        )}
      </AnimatePresence>
    </>
  );
};

export default AddPost;
