import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { getPosts, resetPosts, setPostCreated } from 'redux/slices/postSlice';

import PostCard from './PostCard';
import { IPostExtended } from '../../shared/interfaces/IPost';
import PostListSkeleton from './PostListSkeleton';
import SearchPost from '../SearchPost';

interface IPostList {
    children?: React.ReactNode;
    className?: string;
}

const PostList = ({ children, className }: IPostList) => {
    const dispatch = useAppDispatch();
    const { email } = useParams();

    const posts = useAppSelector((state) => state.postReducer.posts);
    const totalPostsNumber = useAppSelector(
        (state) => state.postReducer.totalPostsNumber
    );
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const isPostCreated = useAppSelector(
        (state) => state.postReducer.isPostCreated
    );

    const fetchPosts = React.useCallback(async (limit = 10) => {
        try {
            dispatch(resetPosts());
            await dispatch(getPosts({ limit, page: 1, search, email }));
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, search, email]);

    const fetchMorePosts = React.useCallback(async () => {
        try {
            await dispatch(
                getPosts({ limit: 10, page: page + 1, search, email })
            );
            setPage((prev) => prev + 1);
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, page, search, email]);

    React.useEffect(() => {
        fetchPosts();
        setPage(1);
    }, [fetchPosts]);

    React.useEffect(() => {
        if (isPostCreated) {
            fetchPosts();
            setPage(1);
            dispatch(setPostCreated(false));
        }
    }, [isPostCreated, dispatch, fetchPosts]);

    return (
        <div
            className={`col-span-3 flex w-full
            flex-col gap-10 justify-self-center md:w-10/12 ${className}`}
        >
            <div className="flex flex-col items-center gap-5 md:flex-row md:flex-wrap xl:flex-nowrap">
                <SearchPost search={search} setSearch={setSearch} />
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
                    <PostCard key={post._id} post={post} />
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default PostList;
