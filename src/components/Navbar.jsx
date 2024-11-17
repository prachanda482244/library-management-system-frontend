import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { pages, loggedInPages } from "../constants/constants";
import { getNotification, logoutUSER } from "../config/AxiosInstance";
import { logoutUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { AiOutlineBell } from "react-icons/ai";
import io from "socket.io-client";
import { fetchCartData } from "../store/slices/cartSlice";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user);
  const { cartItems, status } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUSER();
      dispatch(logoutUser());
      navigate("/sign-in");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout, please try again.");
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotification();
      setNotifications(data.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (user.isLoggedIn) {
      socket.emit("join", user.userData.id);
      fetchNotifications();

      socket.on("bookNotification", (notification) => {
        console.log("Notification received:", notification);
        setNotifications((prev) => [...prev, notification]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);


  const profileDropdownOptions = [
    { name: "Profile", path: "/profile" },
    { name: "Logout", logoutFunction: handleLogout },
  ];

  const handleShowNotification = async (notificationId) => {
    setNotificationOpen(!notificationOpen);
    const { data } = await AxiosInstance.post("/notification/markAsSeen", {
      notificationId,
    });
    if (data.statusCode === 200) {
      navigate("/books");
    }
  };

  useEffect(() => {
    dispatch(fetchCartData());
  }, [status]);
  
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold">
            Library Management System
          </Link>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center"
        >
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        <div className="hidden md:flex space-x-4 items-center">
          {user.isLoggedIn && (
            <>
              <div className="relative mt-2">
                <button
                  onClick={handleShowNotification}
                  className="focus:outline-none"
                >
                  <AiOutlineBell className="h-6 w-6 text-gray-700 hover:text-blue-500" />
                </button>
                {notificationOpen && (
                  <div className="absolute -right-5 mt-2 w-80 bg-white shadow-lg rounded-lg py-2 z-20">
                    <div className="relative max-h-60 overflow-y-auto bg-white shadow-lg rounded-lg py-2 z-20 transition-transform transform duration-200 ease-in-out">
                      {notifications.length > 0 ? (
                        notifications.map((ntf, index) => (
                          <button
                            key={index}
                            className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-200 rounded-lg transition-colors duration-200 ease-in-out"
                            onClick={() => handleShowNotification(ntf._id)}
                          >
                            {ntf.message}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No notifications available.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {user.isLoggedIn ? (
            <>
              {loggedInPages.map((page) => (
                <NavLink
                  to={page.path}
                  key={page.name}
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-blue-500" : ""
                    } text-gray-700 hover:text-blue-500`
                  }
                >
                  {page.name}
                </NavLink>
              ))}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.userData.avatar}
                    alt="User Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-40">
                    {profileDropdownOptions.map((option) => (
                      <button
                        key={option.name}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          if (option.logoutFunction) {
                            option.logoutFunction();
                          } else {
                            navigate(option.path);
                          }
                        }}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            pages.map((page) => (
              <NavLink
                to={page.path}
                key={page.name}
                className={({ isActive }) =>
                  `${
                    isActive ? "text-blue-500" : ""
                  } text-gray-700 hover:text-blue-500`
                }
              >
                {page.name}
              </NavLink>
            ))
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          {user.isLoggedIn ? (
            <>
              {loggedInPages.map((page) => (
                <NavLink
                  key={page.name}
                  to={page.path}
                  className="block text-gray-700 hover:text-blue-500 px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {page.name}
                </NavLink>
              ))}
              <div className="block text-gray-700 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.userData.avatar}
                    alt="User Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>

                {profileDropdownOptions.map((option) => (
                  <button
                    key={option.name}
                    className="block w-full text-left text-gray-700 hover:text-blue-500 px-4 py-2"
                    onClick={() => {
                      setIsOpen(false);
                      if (option.logoutFunction) {
                        option.logoutFunction();
                      } else {
                        navigate(option.path);
                      }
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            pages.map((page) => (
              <NavLink
                key={page.name}
                to={page.path}
                className="block text-gray-700 hover:text-blue-500 px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {page.name}
              </NavLink>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
