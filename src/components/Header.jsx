import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { CgOrganisation } from "react-icons/cg";
import { MdConnectWithoutContact } from "react-icons/md";
import SideDrawer from "./SideDrawer";
import UserSearch from "./UserSearch"; // Import the new UserSearch component

const Header = ({ HeaderClassNames }) => {
  const path = "src/Media/logo.svg";
  const [menu, setMenu] = useState(false);

  const handleMenuClick = () => {
    setMenu(!menu);
  };

  return (
    <>
      <nav className={`${HeaderClassNames} flex items-center justify-between`}>
        {/* Logo and App Name */}
        <div className="logo flex items-center space-x-1 ml-5">
          <div className="img w-7">
            <img src={path} alt="logo" />
          </div>
          <div className="appName">
            <span className="text-xl">AMIPLACE</span>
            <div className="slogan text-xs opacity-50">
              Place where your career starts
            </div>
          </div>
        </div>

        {/* UserSearch Component */}
        <div className="flex-grow mx-4 max-w-md">
          <UserSearch />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center mr-5">
          <Link to="/" className="nav-link mx-3">
            Community
          </Link>
          <Link to="/Companies" className="nav-link mx-3">
            Companies
          </Link>
          <SideDrawer />
        </div>

        {/* Mobile Menu Icon */}
        <FiMenu
          className="md:hidden mr-5 text-2xl cursor-pointer"
          onClick={handleMenuClick}
        />
      </nav>

      {/* Mobile Menu */}
      {menu && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-50">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={handleMenuClick}
            >
              <MdConnectWithoutContact className="text-xl" />
              <span>Community</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2"
              onClick={handleMenuClick}
            >
              <CgProfile className="text-xl" />
              <span>Profile</span>
            </Link>
            <Link
              to="/companies"
              className="flex items-center space-x-2"
              onClick={handleMenuClick}
            >
              <CgOrganisation className="text-xl" />
              <span>Companies</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
