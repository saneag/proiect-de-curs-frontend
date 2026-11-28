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
        <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-2 px-3 md:grid-cols-3 md:justify-items-center md:px-0">
          <div>
            <NavLink to="/">
              <img src={logo} alt="Home" className="h-10 md:h-12" />
            </NavLink>
          </div>
          <div className="relative col-start-3 flex items-center justify-end md:w-1/3 md:justify-center">
            <UserDropdown dropdownLinks={dropdownLinks} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
