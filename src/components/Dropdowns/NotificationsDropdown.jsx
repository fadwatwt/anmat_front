import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import { RiNotification3Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { io } from "socket.io-client";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const { t, i18n } = useTranslation();
  const notificationRef = useRef(null);
  const socketRef = useRef(null);
  const socketRetryCount = useRef(0);
  const maxRetries = 3;
  const [currentUser, setCurrentUser] = useState(null);

  // Get user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCurrentUser(userData);
    }
  }, []);

  // Fetch notifications when user changes
  useEffect(() => {
    if (currentUser?._id) {
      fetchNotifications();
      setupSocketConnection();
    }

    return () => {
      cleanupSocketConnection();
    };
  }, [currentUser]);

  // Cleanup socket connection
  const cleanupSocketConnection = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  // Setup socket connection with better error handling
  const setupSocketConnection = () => {
    if (!currentUser?._id) return;

    // Cleanup existing socket if any
    cleanupSocketConnection();

    // Determine server URL
    const serverUrl = "http://localhost:5000";

    try {
      // Create new socket connection with better error handling
      socketRef.current = io(serverUrl, {
        auth: {
          token: localStorage.getItem("token"),
          userId: currentUser._id,
        },
        reconnectionAttempts: maxRetries,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true,
      });

      // Socket event listeners
      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        setSocketStatus("connected");
        socketRetryCount.current = 0;
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketStatus("disconnected");
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setSocketStatus("error");

        // If we've exceeded max retries, stop trying to reconnect via socket.io's
        // built-in mechanism and use our fallback polling approach
        if (socketRetryCount.current >= maxRetries) {
          socketRef.current.disconnect();
          console.log(
            "Max socket reconnection attempts reached, falling back to polling"
          );
          // Set up polling for notifications instead
          startNotificationPolling();
        }

        socketRetryCount.current++;
      });

      // Notification listeners
      socketRef.current.on("notification:new", (notification) => {
        handleNewNotification(notification);
      });

      socketRef.current.on("notification:update", (updatedNotification) => {
        handleUpdatedNotification(updatedNotification);
      });
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      setSocketStatus("error");
      // Fall back to polling for notifications
      startNotificationPolling();
    }
  };

  // Fallback: Poll for notifications if socket connection fails
  const startNotificationPolling = () => {
    // Clear any existing interval
    if (window.notificationPollingInterval) {
      clearInterval(window.notificationPollingInterval);
    }

    // Set up polling interval (every 30 seconds)
    window.notificationPollingInterval = setInterval(() => {
      if (currentUser?._id) {
        fetchNotifications();
      }
    }, 30000);

    // Initially fetch notifications immediately
    fetchNotifications();

    return () => {
      if (window.notificationPollingInterval) {
        clearInterval(window.notificationPollingInterval);
      }
    };
  };

  const handleNewNotification = (notification) => {
    setNotifications((prev) => {
      // Check if notification already exists
      const exists = prev.some((n) => n._id === notification._id);
      if (exists) return prev;

      return [mapNotificationFromAPI(notification), ...prev];
    });

    setUnreadCount((count) => count + 1);

    // Optional: Play sound or show toast for new notification
    if (Notification.permission === "granted") {
      new Notification("New notification", {
        body: notification.message,
      });
    }
  };

  const handleUpdatedNotification = (updatedNotification) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === updatedNotification._id
          ? mapNotificationFromAPI(updatedNotification)
          : notif
      )
    );

    if (updatedNotification.isRead) {
      setUnreadCount((count) => Math.max(0, count - 1));
    }
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Request notification permission
  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications from API with better error handling
  const fetchNotifications = async () => {
    if (!currentUser?._id) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/notifications/employee/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.data) {
        const mappedNotifications = response.data.data.map(
          mapNotificationFromAPI
        );

        // Sort notifications by date (newest first)
        mappedNotifications.sort((a, b) => {
          const dateA = a.originalData?.createdAt
            ? new Date(a.originalData.createdAt)
            : new Date(0);
          const dateB = b.originalData?.createdAt
            ? new Date(b.originalData.createdAt)
            : new Date(0);
          return dateB - dateA;
        });

        setNotifications(mappedNotifications);
        setUnreadCount(mappedNotifications.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Don't update state on error to keep existing notifications visible
    } finally {
      setIsLoading(false);
    }
  };

  // Map API notification to UI format
  const mapNotificationFromAPI = (apiNotification) => {
    if (!apiNotification) return null;

    let avatar,
      avatarColor,
      avatarImage = false;

    switch (apiNotification.type) {
      case "task":
        avatar = "T";
        avatarColor = "bg-blue-100 text-blue-500";
        break;
      case "financial":
        avatar = "$";
        avatarColor = "bg-green-100 text-green-500";
        break;
      case "rotation":
        avatar = "R";
        avatarColor = "bg-purple-100 text-purple-500";
        break;
      case "chat":
        avatar = "C";
        avatarColor = "bg-indigo-100 text-indigo-500";
        break;
      default:
        avatar = "!";
        avatarColor =
          apiNotification.priority === "high"
            ? "bg-red-100 text-red-500"
            : "bg-gray-100 text-gray-500";
    }

    if (apiNotification.sender?.name) {
      avatar = apiNotification.sender.name.charAt(0).toUpperCase();
      avatarColor = "bg-blue-100 text-blue-500";

      if (apiNotification.sender.avatar) {
        avatar = apiNotification.sender.avatar;
        avatarImage = true;
        avatarColor = null;
      }
    }

    const time = apiNotification.createdAt
      ? formatDistanceToNow(new Date(apiNotification.createdAt), {
          addSuffix: true,
        })
      : "";

    let actionButton = null;
    if (apiNotification.type === "task" && apiNotification.relatedEntity) {
      actionButton = t("View Task");
    } else if (
      apiNotification.type === "chat" &&
      apiNotification.relatedEntity
    ) {
      actionButton = t("Open Chat");
    }

    return {
      id: apiNotification._id,
      _id: apiNotification._id,
      avatar,
      avatarImage,
      avatarColor,
      user: apiNotification.sender?.name,
      content: apiNotification.message,
      time,
      isRead: apiNotification.isRead,
      actionButton,
      originalData: apiNotification,
    };
  };

  // Mark all as read with more robust error handling
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((notif) => !notif.isRead)
        .map((notif) => notif._id);

      if (unreadIds.length === 0) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);

      await axios.patch(
        "/api/notifications/mark-all-read",
        { notificationIds: unreadIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 8000,
        }
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      // Revert on error
      fetchNotifications();
    }
  };

  // Mark single as read with better error handling
  const markAsRead = async (notificationId) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await axios.patch(
        `/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 8000,
        }
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
      // Revert on error
      fetchNotifications();
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Handle navigation based on notification type
    if (notification.actionButton) {
      const originalData = notification.originalData;
      // You would implement your navigation logic here
      console.log(
        `Action for ${originalData.type}:`,
        originalData.relatedEntity
      );
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        className={`p-2 rounded-full relative ${
          showNotifications
            ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
            : "bg-gray-100 dark:bg-gray-700"
        }`}
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <RiNotification3Line size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium dark:text-white">
              {t("Notifications")} ({unreadCount})
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-500 dark:text-blue-400 text-sm hover:underline"
              >
                {t("Mark all as read")}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("No notifications")}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50 dark:bg-blue-900/10" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className="mr-3">
                      <Avatar
                        user={notification.user || "System"}
                        avatar={notification.avatar}
                        avatarImage={notification.avatarImage}
                        avatarColor={notification.avatarColor}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm dark:text-gray-200">
                        {notification.content}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      {notification.actionButton && (
                        <button className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          {notification.actionButton}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t dark:border-gray-700 text-center">
            {socketStatus === "error" && (
              <div className="mb-2 text-xs text-amber-500">
                {t("Using offline mode")}
              </div>
            )}
            <button
              onClick={() => {
                // Navigate to all notifications
                console.log("View all notifications");
                setShowNotifications(false);
              }}
              className="text-blue-500 dark:text-blue-400 text-sm hover:underline"
            >
              {t("View all notifications")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
