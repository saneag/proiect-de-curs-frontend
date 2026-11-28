import { Link } from 'react-router-dom';
import {
  ChartColumn,
  Flame,
  MessageCircleMore,
  ThumbsUp,
  UsersRound,
} from 'lucide-react';

import { useAppSelector } from 'redux/store';
import ImageRenderer from 'components/ImageRenderer';
import { timeAgo } from 'utils/timeAgo';
import SideCard from './SideCard';
import { useSidebarData } from './useSidebarData';

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center rounded-xl bg-gray-50 py-2">
    <span className="text-xl font-bold text-gray-900">{value}</span>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

/** People to follow, trending posts, recent activity and community stats. */
const RightSidebar = () => {
  const me = useAppSelector((state) => state.userReducer.user);
  const data = useSidebarData(me.id);

  if (!data) {
    return (
      <aside
        className="sticky top-20 -mx-1 hidden max-h-[calc(100vh-6rem)] scrollbar flex-col gap-4 overflow-y-auto overscroll-contain px-1 pb-1 md:flex"
        aria-hidden
      >
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl bg-gray-200"
          />
        ))}
      </aside>
    );
  }

  return (
    <aside className="sticky top-20 -mx-1 hidden max-h-[calc(100vh-6rem)] scrollbar flex-col gap-4 overflow-y-auto overscroll-contain px-1 pb-1 md:flex">
      {data.people.length > 0 && (
        <SideCard
          title="People to follow"
          icon={<UsersRound className="size-5" />}
        >
          <ul className="flex flex-col gap-3">
            {data.people.map((person) => (
              <li key={person.id} className="flex items-center gap-3">
                <ImageRenderer
                  imageUrl={person.avatarUrl}
                  type="userAvatar"
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1 truncate font-medium text-gray-900">
                  {person.firstName} {person.lastName}
                </span>
                <Link
                  to={`/userProfile/${person.id}`}
                  className="shrink-0 rounded-full border border-blue-600 px-3 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  View profile
                </Link>
              </li>
            ))}
          </ul>
        </SideCard>
      )}

      {data.trending.length > 0 && (
        <SideCard title="Trending" icon={<Flame className="size-5" />}>
          <ol className="flex flex-col gap-3">
            {data.trending.map((post, index) => (
              <li key={post.id} className="flex items-start gap-3">
                <span className="w-4 shrink-0 text-sm font-bold text-gray-500">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 leading-snug font-medium text-gray-900">
                    {post.title}
                  </p>
                  <p className="truncate text-xs text-gray-600">
                    {post.author}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm text-gray-600">
                  <ThumbsUp className="size-4" />
                  {post.likes}
                </span>
              </li>
            ))}
          </ol>
        </SideCard>
      )}

      <SideCard
        title="Recent activity"
        icon={<MessageCircleMore className="size-5" />}
      >
        {data.activity.length === 0 ? (
          <p className="text-sm text-gray-600">
            New comments on your posts will show up here.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {data.activity.map((item) => (
              <li key={item.id} className="flex gap-3">
                <ImageRenderer
                  imageUrl={item.avatarUrl}
                  type="userAvatar"
                  alt=""
                  className="size-8 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{item.author}</span>{' '}
                    commented on{' '}
                    <span className="font-medium">{item.postTitle}</span>
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    “{item.snippet}”
                  </p>
                  <p className="text-xs text-gray-500">
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SideCard>

      <SideCard title="Community" icon={<ChartColumn className="size-5" />}>
        <div className="grid grid-cols-3 gap-2">
          <Stat value={data.stats.members} label="Members" />
          <Stat value={data.stats.posts} label="Posts" />
          <Stat value={data.stats.comments} label="Comments" />
        </div>
      </SideCard>
    </aside>
  );
};

export default RightSidebar;
