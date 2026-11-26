import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import axios from 'services/axios.service';
import { isAxiosError } from 'axios';
import { IPostExtended } from 'shared/interfaces/IPost';

type Post = {
    limit: number;
    page: number;
    search: string;
    email?: string;
};

export const getPosts = createAsyncThunk(
    'post/getPosts',
    async ({ limit, page, search, email = '' }: Post) => {
        try {
            const response = await axios.get(
                `/get-posts?limit=${limit}&page=${page}&search=${encodeURIComponent(search)}&email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                }
            );

            return {
                posts: response.data.posts,
                totalPostsNumber: response.data.totalPostsNumber,
                status: response.status as number,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return {
                    posts: [],
                    totalPostsNumber: 0,
                    status: error.response?.status ?? 500,
                };
            }

            return {
                posts: [],
                totalPostsNumber: 0,
                status: 500,
            };
        }
    }
);

export const getPost = createAsyncThunk(
    'post/getPost',
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/get-post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });

            return {
                post: response.data.post,
                status: response.status,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue({
                    post: null,
                    status: error.response?.status,
                });
            }

            return rejectWithValue({
                post: null,
                status: 500,
            });
        }
    }
);

export const createBasicPost = createAsyncThunk(
    'post/createBasicPost',
    async (
        { title, content }: { title: string; content: string },
        { rejectWithValue }
    ) => {
        try {
            const contentRemovedClass = content.replace(/ class=".*?"/g, '');

            const response = await axios.post(
                '/create-post',
                {
                    title,
                    content: contentRemovedClass,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                }
            );

            return {
                status: response.status,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue({
                    status: error.response?.status,
                });
            }

            return rejectWithValue({
                status: 500,
            });
        }
    }
);

export const createPostWithImage = createAsyncThunk(
    'post/createPostWithImage',
    async (
        {
            title,
            content,
            image,
        }: { title: string; content: string; image: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                '/create-post-with-image',
                {
                    title,
                    content,
                    image,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                }
            );

            return {
                status: response.status,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue({
                    status: error.response?.status,
                });
            }

            return rejectWithValue({
                status: 500,
            });
        }
    }
);

export const updatePost = createAsyncThunk(
    'post/updatePost',
    async (content: string) => {
        try {
            const response = await axios.patch('/update-post', { content });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                return {};
            }

            return {};
        }
    }
);

export const deletePost = createAsyncThunk(
    'post/deletePost',
    async (postId: string) => {
        try {
            const response = await axios.delete(`/delete-post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });

            return {
                status: response.status,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return {};
            }

            return {};
        }
    }
);

export const addPostImage = createAsyncThunk(
    'post/addPostImage',
    async (formData: FormData) => {
        try {
            const response = await axios.post('/post/postImage', formData, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            return {
                url: response.data.url,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return {};
            }

            return {};
        }
    }
);

export const deletePostImage = createAsyncThunk(
    'post/deletePostImage',
    async (filePath: string) => {
        try {
            const fileName = filePath.split('uploads/')[1]?.split('/').pop();
            await axios.delete(`/post/postImage/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            return {
                url: '',
            };
        } catch {
            return {
                status: 500,
            };
        }
    }
);

export const reactToPost = createAsyncThunk(
    'post/reactToPost',
    async ({
        postId,
        reactionType,
        comment,
    }: {
        postId: string;
        reactionType: string;
        comment?: string;
    }) => {
        try {
            await axios.patch(
                `/react-to-post/${postId}/${reactionType}`,
                { content: comment },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    },
                }
            );
            return {
                postId: postId,
                reactionType: reactionType,
                comment: comment,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                return {};
            }

            return {};
        }
    }
);

const initialState = {
    posts: [] as IPostExtended[],
    totalPostsNumber: 0,
    status: 200,
    isPostCreated: false,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        resetPosts: (state) => {
            state.posts = [];
            state.totalPostsNumber = 0;
            state.status = 200;
        },
        setPostCreated: (state, action) => {
            state.isPostCreated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPosts.fulfilled, (state, action) => {
            state.posts.push(...action.payload.posts);
            state.totalPostsNumber = action.payload.totalPostsNumber;
            state.status = action.payload.status;
        });
        builder.addCase(createBasicPost.fulfilled, (state, action) => {
            state.status = action.payload.status;
        });
        builder.addCase(createPostWithImage.fulfilled, (state, action) => {
            state.status = action.payload.status;
        });
        builder.addCase(updatePost.fulfilled, (state, action) => {
            state.posts = action.payload.posts;
            state.status = action.payload.status;
        });
        builder.addCase(deletePost.fulfilled, (state, action) => {
            state.status = action.payload.status ?? state.status;
        });
        builder.addCase(getPost.fulfilled, (state, action) => {
            const postIndex = state.posts.findIndex(
                (post) => post.id === action.payload.post.id
            );
            state.posts[postIndex] = action.payload.post;
        });
    },
});

export default postSlice.reducer;

export const { resetPosts, setPostCreated } = postSlice.actions;
