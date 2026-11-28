import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircleText, ThumbsDown, ThumbsUp } from 'lucide-react';
import { convertNumber } from 'utils/convertBigNumber';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getPost, reactToPost } from 'redux/slices/postSlice';
import { CommentInputContext, PostContext } from '../index';

const EmojiPicker = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.userReducer.user);

  const { showCommentInput, setShowCommentInput } =
    React.useContext(CommentInputContext);
  const { userPost } = React.useContext(PostContext);

  const checkIfUserLiked = () => {
    return userPost.reactions.find(
      (reaction) => reaction.userId === user.id && reaction.like,
    );
  };

  const checkIfUserDisliked = () => {
    return userPost.reactions.find(
      (reaction) => reaction.userId === user.id && reaction.dislike,
    );
  };

  const handleLike = async () => {
    await dispatch(
      reactToPost({
        postId: userPost.id,
        reactionType: 'like',
      }),
    );

    await dispatch(getPost({ postId: userPost.id }));
  };

  const handleDislike = async () => {
    await dispatch(
      reactToPost({
        postId: userPost.id,
        reactionType: 'dislike',
      }),
    );

    await dispatch(getPost({ postId: userPost.id }));
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <motion.button
          type="button"
          aria-label="Like"
          aria-pressed={!!checkIfUserLiked()}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.8 }}
          className="cursor-pointer"
          onClick={handleLike}
        >
          <ThumbsUp
            className={`size-6 ${
              checkIfUserLiked() ? 'fill-blue-400 stroke-blue-700' : ''
            }`}
          />
        </motion.button>
        <span className="leading-3">
          {convertNumber(userPost.numberOfLikes)}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <motion.button
          type="button"
          aria-label="Dislike"
          aria-pressed={!!checkIfUserDisliked()}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.8 }}
          className="cursor-pointer"
          onClick={handleDislike}
        >
          <ThumbsDown
            className={`size-6 ${
              checkIfUserDisliked() ? 'fill-gray-500 stroke-gray-900' : ''
            }`}
          />
        </motion.button>
        <span className="leading-3">
          {convertNumber(userPost.numberOfDislikes)}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <motion.button
          type="button"
          aria-label="Comments"
          aria-expanded={showCommentInput}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.8 }}
          className="cursor-pointer"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <MessageCircleText className="size-6" />
        </motion.button>
        <span className="leading-3">{userPost.numberOfComments}</span>
      </div>
    </div>
  );
};

export default EmojiPicker;
