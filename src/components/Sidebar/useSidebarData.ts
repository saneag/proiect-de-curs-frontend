import { useEffect, useState } from 'react';

import axios from 'services/axios.service';
import { type IUserResponse } from 'shared/interfaces/IUser';

export interface ISidebarData {
  stats: { members: number; posts: number; comments: number };
  trending: { id: string; title: string; likes: number; author: string }[];
  activity: {
    id: string;
    postId: string;
    postTitle: string;
    author: string;
    avatarUrl: string;
    snippet: string;
    createdAt: string;
  }[];
  people: IUserResponse[];
}

const PEOPLE_LIMIT = 5;

// A different handful of members each visit, never including the signed-in user.
const pickPeople = (users: IUserResponse[], meId: string) =>
  users
    .filter((user) => user.id !== meId)
    .map((user) => ({ user, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, PEOPLE_LIMIT)
    .map(({ user }) => user);

/** Loads the side panels once. A failed request only hides that panel. */
export function useSidebarData(meId: string) {
  const [data, setData] = useState<ISidebarData | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([axios.get('/sidebar'), axios.get('/users')]).then(
      ([sidebar, users]) => {
        if (cancelled) return;
        const side = sidebar.status === 'fulfilled' ? sidebar.value.data : null;
        const everyone: IUserResponse[] =
          users.status === 'fulfilled' ? users.value.data.users : [];

        setData({
          stats: side?.stats ?? {
            members: everyone.length,
            posts: 0,
            comments: 0,
          },
          trending: side?.trending ?? [],
          activity: side?.activity ?? [],
          people: pickPeople(everyone, meId),
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [meId]);

  return data;
}
