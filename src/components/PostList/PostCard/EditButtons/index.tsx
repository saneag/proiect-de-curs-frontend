import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { useAppDispatch } from 'redux/store';
import { deletePost, setPostCreated } from 'redux/slices/postSlice';
import { type IPostExtended } from 'shared/interfaces/IPost';
import PostForm from '../../AddPost/PostForm';

interface EditButtonsProps {
  post: IPostExtended;
}

const itemClass =
  'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition';

const EditButtons = ({ post }: EditButtonsProps) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleDelete = async () => {
    setIsOpen(false);
    await dispatch(deletePost(post.id));
    dispatch(setPostCreated(true));
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Post options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreHorizontal className="size-5" />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-1 w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-gray-700 hover:bg-gray-100`}
            onClick={() => {
              setIsOpen(false);
              setIsEditing(true);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-red-600 hover:bg-red-50`}
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      )}
      <AnimatePresence>
        {isEditing && (
          <PostForm setIsAddPostFormOpen={setIsEditing} post={post} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditButtons;
