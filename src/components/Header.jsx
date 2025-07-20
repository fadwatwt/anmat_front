"use client"

import SearchInput from "./Form/SearchInput.jsx";

import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import React from "react";

import PropTypes from "prop-types";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import NotificationsDropdown from "./Dropdowns/NotificationsDropdown.jsx";
import MessagesDropdown from "./Dropdowns/MessagesDropdown.jsx";
import HeaderUserMenu from "./Dropdowns/HeaderUserMenu.jsx";

const Header = React.memo(({ taggleSlidebarOpen, className }) => {


  // Close dropdown when clicking outside

  return (
    <div
      className={
        "header dark:bg-gray-800 max-w-full bg-white h-[72px] flex px-8 items-center justify-between relative " +
        className
      }
    >
      <button
        onClick={taggleSlidebarOpen}
        className="inline-flex items-center p-2 text-sm h-8 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <HiOutlineMenuAlt2 />
      </button>
      <div className="hidden md:block">
        <SearchInput />
      </div>
      <div className={"flex gap-5"}>
        <div className={"icons flex gap-2 items-center relative w-56 justify-end"}>
          <NotificationsDropdown notifications={[]} />
          <MessagesDropdown messages={[]} />
        </div>

        {/* User Profile Section */}
        <HeaderUserMenu />
      </div>
    </div>
  );
});

Header.displayName = "HeaderComponent"

Header.propTypes = {
  taggleSlidebarOpen: PropTypes.func,
  className: PropTypes.string,
};

export default Header;
