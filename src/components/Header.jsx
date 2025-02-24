import SearchInput from "./Form/SearchInput.jsx";

import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import PropTypes from "prop-types";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import NotificationsDropdown from "./Dropdowns/NotificationsDropdown.jsx";
import MessagesDropdown from "./Dropdowns/MessagesDropdown.jsx";

function Header({ taggleSlidebarOpen, className }) {
  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      avatar: "A",
      avatarColor: "bg-blue-100 text-blue-500",
      content: (
        <>
          <span className="font-medium">A new task Client Proposal Review</span>{" "}
          was added by Project Manager Sara Ahmed.
        </>
      ),
      time: "30 mins ago",
      isRead: false,
    },
    {
      id: 2,
      avatar: "/path-to-ibn-avatar.jpg",
      avatarImage: true,
      user: "Ibn Sina",
      content: (
        <>
          made an action{" "}
          <span className="font-medium">
            Lorem Ipsum is simply dummy text of the.
          </span>
        </>
      ),
      time: "2 hour ago",
      isRead: true,
    },
    {
      id: 3,
      avatar: "S",
      avatarColor: "bg-blue-100 text-blue-500",
      content: (
        <>
          <span className="font-medium">Sarah Ahmed</span> scheduled a team
          meeting <span className="font-medium">Sprint Planning</span> on Today
          at 3:00 PM.
        </>
      ),
      time: "2 hours ago",
      isRead: false,
      actionButton: "Join the meeting",
    },
    {
      id: 4,
      avatar: "!",
      avatarColor: "bg-red-100 text-red-500",
      content: (
        <>
          The task{" "}
          <span className="font-medium">Finalize Project Proposal</span> is
          overdue by 3 days. Immediate action required!
        </>
      ),
      time: "2 weeks ago",
      isRead: false,
    },

    {
      id: 6,
      avatar: "!",
      avatarColor: "bg-red-100 text-red-500",
      content: (
        <>
          The task{" "}
          <span className="font-medium">Finalize Project Proposal</span> is
          overdue by 3 days. Immediate action required!
        </>
      ),
      time: "2 weeks ago",
      isRead: false,
    },

    {
      id: 6,
      avatar: "!",
      avatarColor: "bg-red-100 text-red-500",
      content: (
        <>
          The task{" "}
          <span className="font-medium">Finalize Project Proposal</span> is
          overdue by 3 days. Immediate action required!
        </>
      ),
      time: "2 weeks ago",
      isRead: false,
    },

    {
      id: 6,
      avatar: "!",
      avatarColor: "bg-red-100 text-red-500",
      content: (
        <>
          The task{" "}
          <span className="font-medium">Finalize Project Proposal</span> is
          overdue by 3 days. Immediate action required!
        </>
      ),
      time: "2 weeks ago",
      isRead: false,
    },
  ];

  // Mock data for messages
  const messages = [
    {
      id: 1,
      avatar: "/path-to-ibn-avatar.jpg",
      avatarImage: true,
      user: "Ibn Sina",
      content:
        "Ugh, this bug is driving me crazy! Any ideas on how to fix this...",
      time: "5 Mins Ago",
      isRead: false,
    },
    {
      id: 2,
      avatar: "/path-to-maya-avatar.jpg",
      avatarImage: true,
      user: "Maya Patel",
      content: "Does anyone know how to configure the CI/CD pipeline fo...",
      time: "20 Mins Ago",
      isRead: true,
    },
    {
      id: 3,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
    {
      id: 4,
      avatar: "/path-to-amr-avatar.jpg",
      avatarImage: true,
      user: "Amr Mehanna",
      content:
        "Hey, I'm having trouble with the API integration. Can we pair...",
      time: "3 Hours Ago",
      isRead: false,
    },
    {
      id: 5,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
    {
      id: 6,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
    {
      id: 5,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
    {
      id: 6,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
    {
      id: 5,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
    {
      id: 6,
      avatar: "/path-to-ethan-avatar.jpg",
      avatarImage: true,
      user: "Ethan Kim",
      content:
        "Just finished the unit tests for the login feature. Coverage loo...",
      time: "2 Hours Ago",
      isRead: false,
    },
  ];

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
        <div className={"icons flex gap-2 items-center"}>
          <NotificationsDropdown notifications={notifications} />
          <MessagesDropdown messages={messages} />
        </div>

        {/* User Profile Section */}
        <div
          className={
            "flex box-border rounded-lg border-2 dark:border-gray-700 md:py-0.5 md:px-1 px-0.5 py-0.5 items-center gap-1 cursor-pointer"
          }
        >
          <div className={"p-1"}>
            <img
              src={
                "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              }
              className={"w-8 h-8 rounded-full"}
              alt={"image-profile"}
            />
          </div>
          <p className={"dark:text-gray-400 text-sm sm:block hidden"}>
            Rawan Ahmed
          </p>
          <MdOutlineKeyboardArrowDown />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  taggleSlidebarOpen: PropTypes.func,
  className: PropTypes.string,
};

export default Header;
