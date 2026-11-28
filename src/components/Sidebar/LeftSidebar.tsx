import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, House, LogOut, Settings } from 'lucide-react';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { logout } from 'redux/slices/userSlice';
import ImageRenderer from 'components/ImageRenderer';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition ${
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
  }`;

/** Profile summary and quick links, shown on the left of the feed. */
const LeftSidebar = () => {
  const user = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <aside className="sticky top-20 -mx-1 hidden max-h-[calc(100vh-6rem)] scrollbar flex-col gap-4 overflow-y-auto overscroll-contain px-1 pb-1 xl:flex">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-16 bg-linear-to-r from-blue-700 to-blue-500" />
        <div className="-mt-9 flex flex-col items-center px-4 pb-4 text-center">
          <div className="rounded-full bg-white p-1">
            <ImageRenderer
              imageUrl={user.avatarUrl}
              type="userAvatar"
              alt=""
              className="size-16 rounded-full object-cover"
            />
          </div>
          <span className="mt-2 text-lg font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </span>
          <span className="line-clamp-3 text-sm text-gray-600">
            {user.description ? (
              user.description
            ) : (
              <NavLink
                to="/userProfile"
                className="text-blue-600 hover:underline"
              >
                Add a short bio
              </NavLink>
            )}
          </span>
        </div>
      </section>

      <nav
        aria-label="Quick links"
        className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
      >
        <NavLink to="/" end className={linkClass}>
          <House className="size-5" />
          Home
        </NavLink>
        <NavLink to={`/myPosts/${user.email}`} className={linkClass}>
          <FileText className="size-5" />
          My posts
        </NavLink>
        <NavLink to="/userProfile" end className={linkClass}>
          <Settings className="size-5" />
          Edit profile
        </NavLink>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="size-5" />
          Sign out
        </button>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
