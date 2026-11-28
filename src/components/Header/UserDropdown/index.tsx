import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { type IUserResponse } from 'shared/interfaces/IUser';
import { logout } from 'redux/slices/userSlice';
import { Components } from 'components';

interface Links {
  name: string;
  path: string;
  icon?: string;
}

interface ILinks {
  dropdownLinks: Links[];
}

const UserDropdown = ({ dropdownLinks }: ILinks) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user: IUserResponse = useAppSelector((state) => state.userReducer.user);
  const [isUserInfoOpen, setIsUserInfoOpen] = React.useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const dropdownButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const [width, setWidth] = React.useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <div onMouseLeave={() => setIsUserInfoOpen(false)}>
      <button
        className="flex items-center gap-1 text-white"
        onMouseEnter={() => {
          if (!isMobile) {
            setIsUserInfoOpen(true);
          }
        }}
        onClick={() => {
          if (isMobile) {
            setIsUserInfoOpen(!isUserInfoOpen);
          }
        }}
        ref={dropdownButtonRef}
      >
        <div className="size-9 rounded-full">
          <Components.ImageRenderer
            imageUrl={user.avatarUrl}
            type={'userAvatar'}
            alt={''}
            className={'size-full rounded-full object-cover text-3xl'}
          />
        </div>
        <span className="ml-1">{user.firstName}</span>
        <ChevronDown className="size-4" />
      </button>
      {isUserInfoOpen && (
        <div
          className="absolute top-10.5 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm max-md:right-0 dark:divide-gray-600 dark:bg-gray-700"
          ref={dropdownRef}
        >
          <div className="flex flex-col px-4 py-3 text-white">
            <span className="truncate">
              {user.firstName} {user.lastName}
            </span>
            <span className="truncate">{user.email}</span>
          </div>
          <ul className="px-4 py-3 text-white select-none">
            {dropdownLinks.map((link: Links) => {
              return (
                <li key={link.path}>
                  <Link
                    key={link.path}
                    to={
                      link.path === '/myPosts'
                        ? `${link.path}/${user.email}`
                        : link.path
                    }
                    className="block capitalize"
                    onClick={() => setIsUserInfoOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="block w-full px-4 py-3 text-left text-white select-none"
            onClick={handleLogout}
          >
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
