import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { IPostExtended } from 'shared/interfaces/IPost';

import CardHeader from './PostCardComponents/CardHeader';
import CardBody from './PostCardComponents/CardBody';
import CardFooter from './PostCardComponents/CardFooter';
import CardCommentAdd from './PostCardComponents/CardCommentAdd';
import CardComments from './PostCardComponents/CardComments';

interface PostCardProps {
    post: IPostExtended;
}

interface ICommentInputContext {
    showCommentInput: boolean;
    setShowCommentInput: (value: boolean) => void;
}

interface IPostContext {
    userPost: IPostExtended;
    setUserPost: (value: IPostExtended) => void;
}

export const CommentInputContext = React.createContext<ICommentInputContext>({
    showCommentInput: false,
    setShowCommentInput: () => {},
});

export const PostContext = React.createContext<IPostContext>({
    userPost: {} as IPostExtended,
    setUserPost: () => {},
});

const PostCard = ({ post }: PostCardProps) => {
    const [showCommentInput, setShowCommentInput] = React.useState(false);
    const [userPost, setUserPost] = React.useState<IPostExtended>(post);
    const [prevPost, setPrevPost] = React.useState<IPostExtended>(post);

    if (post !== prevPost) {
        setPrevPost(post);
        setUserPost(post);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full rounded-xl bg-gray-300"
        >
            <PostContext.Provider value={{ userPost, setUserPost }}>
                <CardHeader />
                <CardBody />
                <CommentInputContext.Provider
                    value={{ showCommentInput, setShowCommentInput }}
                >
                    <CardFooter />
                    <AnimatePresence>
                        {showCommentInput && <CardCommentAdd />}
                    </AnimatePresence>
                </CommentInputContext.Provider>
                <CardComments />
            </PostContext.Provider>
        </motion.div>
    );
};

export default PostCard;
