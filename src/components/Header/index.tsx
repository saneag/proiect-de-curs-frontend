import React from 'react';

import links from 'assets/headerLinks.json';
import UserDropdown from './UserDropdown';
import { NavLink } from 'react-router-dom';

import logo from 'assets/icons/logo_no_bg.png';

const Header = () => {
  const dropdownLinks = React.useMemo(() => links[0].dropdownLinks || [], []);

  return (
    <>
      <div className="h-16"></div>
      <div className="fixed top-0 left-0 z-10 h-16 w-full bg-blue-800">
        <div className="grid h-full grid-cols-2 content-center justify-items-center md:grid-cols-3">
          <div className="hidden md:block">
            <NavLink to="/">
              <img src={logo} alt="Home" className="h-12" />
            </NavLink>
          </div>
          <div className="relative col-start-2 flex w-1/3 items-center justify-center md:col-start-3">
            <UserDropdown dropdownLinks={dropdownLinks} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
