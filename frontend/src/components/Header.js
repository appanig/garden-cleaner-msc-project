import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";


const NOTIFICATION_TYPES = {
  NEW_BOOKING: "newBooking",
  BOOKING_UPDATE: "bookingUpdate",
  REVIEW_POSTED: "reviewPosted",
};

const notificationFactory = {
  [NOTIFICATION_TYPES.NEW_BOOKING]: (data) => ({
    id: data.id || Date.now(),
    message: `New booking for ${data.serviceName} on ${data.date} at ${data.place}`,
    link: { to: "/dashboard/provider", state: { openJobs: true } },
    type: NOTIFICATION_TYPES.NEW_BOOKING,
    data,
  }),
  [NOTIFICATION_TYPES.BOOKING_UPDATE]: (data) => {
    let message = "";
    if (data.role === "provider" && data.status === "reviewed") {
      message = `Your booking for ${data.serviceName} has been reviewed`;
    } else if (data.role === "homeowner") {
      message = `${data.homeownerName}, your booking of service ${data.service} on ${data.date} at ${data.place} is ${data.status}!`;
    }
    return {
      id: data.id || Date.now(),
      message,
      link: data.role === "provider" ? { to: "/dashboard/provider" } : { to: "/my-bookings" },
      type: NOTIFICATION_TYPES.BOOKING_UPDATE,
      data,
    };
  },
  [NOTIFICATION_TYPES.REVIEW_POSTED]: (data) => ({
    id: data.id || Date.now(),
    message: `${data.homeowner} posted a review with ${data.rating} stars on ${data.date} on booking #${data.bookingId}`,
    link: { to: "/dashboard/provider", state: { openReviews: true } },
    type: NOTIFICATION_TYPES.REVIEW_POSTED,
    data,
  }),
};

const renderNotification = (notification, onClick) => {
  return (
    <Link
      key={notification.id}
      to={notification.link.to}
      state={notification.link.state || {}}
      onClick={onClick}
    >
      <div className="notification-item">
        <p>{notification.message}</p>
        {notification.type === NOTIFICATION_TYPES.NEW_BOOKING && (
          <>
            <p><strong>{notification.data.serviceName}</strong></p>
            <p>📅 {notification.data.date}</p>
            <p>🏠 {notification.data.place}</p>
          </>
        )}

      </div>
    </Link>
  );
};

function Header() {
  const { user, dispatch } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    if (!user) return;

    const socketHandlers = {
      [NOTIFICATION_TYPES.NEW_BOOKING]: (data) => {
        if (user.role === "provider") {
          setNotifications((prev) => [
            ...prev,
            notificationFactory[NOTIFICATION_TYPES.NEW_BOOKING](data),
          ]);
        }
      },
      [NOTIFICATION_TYPES.BOOKING_UPDATE]: (data) => {
        if (
          (user.role === "provider" && data.status === "reviewed") ||
          (user.role === "homeowner" && ["accepted", "rejected", "completed"].includes(data.status))
        ) {
          setNotifications((prev) => [
            ...prev,
            notificationFactory[NOTIFICATION_TYPES.BOOKING_UPDATE]({ ...data, role: user.role }),
          ]);
        }
      },
      [NOTIFICATION_TYPES.REVIEW_POSTED]: (data) => {
        if (user.role === "provider") {
          setNotifications((prev) => [
            ...prev,
            notificationFactory[NOTIFICATION_TYPES.REVIEW_POSTED](data),
          ]);
        }
      },
    };

    // Register socket listeners
    Object.keys(socketHandlers).forEach((event) => {
      socket.on(event, socketHandlers[event]);
    });

    // Cleanup
    return () => {
      Object.keys(socketHandlers).forEach((event) => {
        socket.off(event, socketHandlers[event]);
      });
    };
  }, [user]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const clearNotifications = () => {
    setNotifications([]);
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          {user?.role === "provider" ? (
            "GardenCleaner"
          ) : (
            <Link to="/">GardenCleaner</Link>
          )}
        </div>

        {/* Hamburger button */}
        <button className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user?.role === "provider" &&
            <>
              <Link to="/dashboard/provider">Dashboard</Link>
              <Link to="/dashboard/orders">Orders</Link>
              <Link to="/dashboard/profile">Profile</Link>
            </>
          }
          {user?.role === "homeowner" && <>
            <Link to="/dashboard/homeowner">Dashboard</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/book">Book</Link>
            <Link to="/providers">Providers</Link>
            <Link to="/homeowner/profile">Profile</Link>
          </>
          }

          {user && (
            <div className="notification-wrapper" onClick={toggleDropdown}>
              <span className="notification-icon"><IoMdNotificationsOutline /></span>
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
              {dropdownOpen && (
                <div className="notification-dropdown">
                  {notifications.length === 0 ? (
                    <p>No new notifications</p>
                  ) : (
                    notifications.map((notification) =>
                      renderNotification(notification, () => setDropdownOpen(false))
                    )
                  )}
                  {notifications.length > 0 && (
                    <button className="clear-btn" onClick={clearNotifications}>
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {user ? (
            <Link>
              <button
                onClick={() => {
                  dispatch({ type: "LOGOUT" });
                  localStorage.clear();
                }}
              >
                Logout
              </button>
            </Link>
          ) : (
            <>
              <Link to="/auth" state={{openLogin: true}}>
                <button className="login-button">Login</button>
              </Link>
              <Link to="/auth" state={{ openRegister: true}}>
                <button className="login-button">Register</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;