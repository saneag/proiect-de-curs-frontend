import React from 'react';
import { motion } from 'framer-motion';
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
            (reaction) => reaction.userId === user.id && reaction.like
        );
    };

    const checkIfUserDisliked = () => {
        return userPost.reactions.find(
            (reaction) => reaction.userId === user.id && reaction.dislike
        );
    };

    const handleLike = async () => {
        await dispatch(
            reactToPost({
                postId: userPost.id,
                reactionType: 'like',
            })
        );

        await dispatch(getPost({ postId: userPost.id }));
    };

    const handleDislike = async () => {
        await dispatch(
            reactToPost({
                postId: userPost.id,
                reactionType: 'dislike',
            })
        );

        await dispatch(getPost({ postId: userPost.id }));
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <motion.span
                    initial={{ scale: 1 }}
                    whileTap={{ scale: 0.8 }}
                    className={`${
                        checkIfUserLiked()
                            ? 'material-icons text-blue-500'
                            : 'material-symbols-outlined'
                    } inline-block cursor-pointer`}
                    onClick={handleLike}
                >
                    thumb_up
                </motion.span>
                <span className="leading-3">
                    {convertNumber(userPost.numberOfLikes)}
                </span>
            </div>
            <div className="flex flex-col items-center">
                <motion.span
                    initial={{ scale: 1 }}
                    whileTap={{ scale: 0.8 }}
                    className={`${
                        checkIfUserDisliked()
                            ? 'material-icons text-gray-800'
                            : 'material-symbols-outlined'
                    } cursor-pointer`}
                    onClick={handleDislike}
                >
                    thumb_down
                </motion.span>
                <span className="leading-3">
                    {convertNumber(userPost.numberOfDislikes)}
                </span>
            </div>
            <div className="flex flex-col items-center">
                <span
                    className="material-symbols-outlined cursor-pointer"
                    onClick={() => setShowCommentInput(!showCommentInput)}
                >
                    comment
                </span>
                <span className="leading-3">{userPost.numberOfComments}</span>
            </div>
        </div>
    );
};

export default EmojiPicker;
