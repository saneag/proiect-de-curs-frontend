import React from 'react';

import { type IPostExtended } from 'shared/interfaces/IPost';

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
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
      <PostContext.Provider value={{ userPost, setUserPost }}>
        <CardHeader />
        <CardBody />
        <CommentInputContext.Provider
          value={{ showCommentInput, setShowCommentInput }}
        >
          <CardFooter />
          {showCommentInput && <CardCommentAdd />}
        </CommentInputContext.Provider>
        <CardComments />
      </PostContext.Provider>
    </div>
  );
};

export default PostCard;
