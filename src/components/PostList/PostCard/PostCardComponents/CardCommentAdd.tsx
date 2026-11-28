import React from 'react';

import { CommentInputContext, PostContext } from '../index';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getPost, reactToPost } from 'redux/slices/postSlice';
import { Components } from '../../../index';

const MAX_LENGTH = 500;

const CardCommentAdd = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer.user);

  const { setShowCommentInput } = React.useContext(CommentInputContext);
  const { userPost } = React.useContext(PostContext);
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const canSubmit = comment.trim() !== '' && !isSubmitting;

  const handleComment = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError('');

    let result: { ok: boolean; message?: string };
    try {
      result = await dispatch(
        reactToPost({
          postId: userPost.id,
          reactionType: 'comment',
          comment: comment.trim(),
        }),
      ).unwrap();
    } catch {
      result = { ok: false };
    }

    if (!result.ok) {
      // Keep the text so nothing is lost, and say what went wrong.
      setError(result.message ?? 'The comment could not be sent.');
      setIsSubmitting(false);
      return;
    }

    await dispatch(getPost({ postId: userPost.id }));

    setComment('');
    setIsSubmitting(false);
    setShowCommentInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void handleComment();
    } else if (e.key === 'Escape') {
      setShowCommentInput(false);
    }
  };

  return (
    <div className="flex gap-3 border-t border-gray-200 px-4 py-3">
      <Components.ImageRenderer
        imageUrl={user.avatarUrl}
        type={'userAvatar'}
        alt={'userAvatar'}
        className={'size-9 shrink-0 rounded-full object-cover'}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={comment}
          rows={2}
          maxLength={MAX_LENGTH}
          placeholder="Write a comment..."
          aria-label="Write a comment"
          className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-900 outline-hidden transition placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          onChange={(e) => {
            setComment(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
        />
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm ${
              comment.length >= MAX_LENGTH - 20
                ? 'font-medium text-red-600'
                : 'text-gray-600'
            }`}
          >
            {comment.length}/{MAX_LENGTH}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              onClick={() => setShowCommentInput(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600 disabled:active:scale-100"
              disabled={!canSubmit}
              onClick={handleComment}
            >
              {isSubmitting ? 'Posting…' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCommentAdd;
