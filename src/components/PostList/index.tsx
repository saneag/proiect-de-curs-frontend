import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { getPosts, resetPosts, setPostCreated } from 'redux/slices/postSlice';

import PostCard from './PostCard';
import { type IPostExtended } from '../../shared/interfaces/IPost';
import PostListSkeleton from './PostListSkeleton';
import SearchPost from '../SearchPost';

interface IPostList {
  children?: React.ReactNode;
  className?: string;
  // Author to list posts for. Falls back to the `:id` route param.
  creatorId?: string;
}

const PostList = ({ children, className, creatorId: authorId }: IPostList) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const creatorId = authorId ?? params.id;

  const posts = useAppSelector((state) => state.postReducer.posts);
  const totalPostsNumber = useAppSelector(
    (state) => state.postReducer.totalPostsNumber,
  );
  const [search, setSearch] = React.useState('');
  const page = Math.ceil(posts.length / 10);
  const isPostCreated = useAppSelector(
    (state) => state.postReducer.isPostCreated,
  );

  const fetchPosts = React.useCallback(
    async (limit = 10) => {
      try {
        dispatch(resetPosts());
        await dispatch(getPosts({ limit, page: 1, search, creatorId }));
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, search, creatorId],
  );

  const fetchMorePosts = React.useCallback(async () => {
    try {
      await dispatch(
        getPosts({ limit: 10, page: page + 1, search, creatorId }),
      );
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, page, search, creatorId]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  React.useEffect(() => {
    if (isPostCreated) {
      fetchPosts();
      dispatch(setPostCreated(false));
    }
  }, [isPostCreated, dispatch, fetchPosts]);

  return (
    <div
      className={`flex w-full max-w-2xl flex-col gap-10 justify-self-center ${className ?? ''}`}
    >
      <div className="flex items-center justify-end gap-3">
        <SearchPost setSearch={setSearch} />
        {children}
      </div>
      <InfiniteScroll
        next={fetchMorePosts}
        hasMore={posts.length < totalPostsNumber}
        loader={<PostListSkeleton />}
        dataLength={posts.length}
        className="flex flex-col gap-10"
      >
        {posts.map((post: IPostExtended) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
