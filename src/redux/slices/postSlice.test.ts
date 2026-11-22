import { describe, expect, it } from 'vitest';
import reducer, { getPost, getPosts } from './postSlice';

describe('PostgreSQL post identifiers', () => {
    it('updates the matching post by id after a reaction or comment', () => {
        const initial = reducer(undefined, {
            type: getPosts.fulfilled.type,
            payload: { posts: [{ id: 'first', numberOfLikes: 0 }, { id: 'second', numberOfLikes: 0 }], totalPostsNumber: 2, status: 200 },
        });
        const result = reducer(initial, {
            type: getPost.fulfilled.type,
            payload: { post: { id: 'second', numberOfLikes: 1 }, status: 200 },
        });
        expect(result.posts).toEqual([{ id: 'first', numberOfLikes: 0 }, { id: 'second', numberOfLikes: 1 }]);
    });
});
