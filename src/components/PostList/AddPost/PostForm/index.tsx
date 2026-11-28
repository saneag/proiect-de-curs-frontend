import React from 'react';
import { motion } from 'framer-motion';
import { FileUploader } from 'react-drag-drop-files';
import { ImagePlus, X } from 'lucide-react';

import { useAppDispatch } from 'redux/store';
import {
  addPostImage,
  createBasicPost,
  createPostWithImage,
  deletePostImage,
  setPostCreated,
} from 'redux/slices/postSlice';

import ImageRenderer from 'components/ImageRenderer';
import { getPlainTextLength } from 'utils/postText';
import FormTitle from './FormFields/FormTitle';
import FormContent from './FormFields/FormContent';

const MAX_CONTENT_LENGTH = 1000;

interface IProps {
  setIsAddPostFormOpen: (isAddPostFormOpen: boolean) => void;
}

const PostForm = ({ setIsAddPostFormOpen }: IProps) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');
  const [image, setImage] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const fileTypes = ['JPG', 'PNG', 'JPEG'];
  const textLength = getPlainTextLength(content);
  const canSubmit =
    title.trim() !== '' &&
    textLength > 0 &&
    textLength <= MAX_CONTENT_LENGTH &&
    !isSubmitting;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAddPostFormOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAddPostFormOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (image !== '') {
      await dispatch(createPostWithImage({ title, content, image }));
    } else {
      await dispatch(createBasicPost({ title, content }));
    }
    setIsAddPostFormOpen(false);
    dispatch(setPostCreated(true));
  };

  const handleRemoveImage = async () => {
    await dispatch(deletePostImage(image));
    setImage('');
  };

  const handleChangeFile = async (e: File | File[]) => {
    const file = Array.isArray(e) ? e[0] : e;
    const formData = new FormData();
    if (image && file.name !== image.split('uploads/')[1]) {
      await dispatch(deletePostImage(image));
    }
    formData.append('postImage', file);

    const { payload } = await dispatch(addPostImage(formData));
    const { url } = payload as { url: string };
    setImage(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsAddPostFormOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-heading"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="new-post-heading"
            className="text-xl font-semibold text-gray-900"
          >
            New post
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsAddPostFormOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          <FormTitle title={title} setTitle={setTitle} />
          <FormContent content={content} setContent={setContent} />

          {image ? (
            <div className="relative">
              <ImageRenderer
                imageUrl={image}
                alt="Post attachment"
                className="max-h-64 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                aria-label="Remove image"
                className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-gray-900/60 text-white transition hover:bg-gray-900/80"
                onClick={handleRemoveImage}
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <FileUploader
              handleChange={handleChangeFile}
              name="file"
              types={fileTypes}
              multiple={false}
              classes="w-full! max-w-none!"
            >
              <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 px-4 py-6 text-gray-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
                <ImagePlus className="size-7" />
                <span className="font-medium">Add a photo</span>
                <span className="text-sm text-gray-400">
                  Drag & drop or click to upload · JPG, PNG, JPEG
                </span>
              </div>
            </FileUploader>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            className="cursor-pointer rounded-full px-5 py-2.5 font-medium text-gray-600 transition hover:bg-gray-100"
            onClick={() => setIsAddPostFormOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600 disabled:active:scale-100"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostForm;
