// redux/notifications/notificationsAPI.js
import { io } from "socket.io-client";
import axios from "axios";
import {
  setNotifications,
  addNotification,
  updateNotification,
  markAllAsRead,
  setSocketStatus,
  setLoading,
  setError,
} from "./notificationsSlice";

// Module-level variable for socket
let socket = null;

// Thunk for fetching notifications
export const fetchNotifications = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const { auth } = getState();

    // Ensure we have valid auth data
    if (!auth.user?._id || !auth.token) {
      console.error("Missing auth data for notifications");
      return;
    }

    const response = await axios.get(
      `/api/notifications/employee/${auth.user._id}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    dispatch(setNotifications(response.data.data));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    dispatch(setError(error.message || "Failed to fetch notifications"));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk for marking all as read
export const markAllNotificationsAsRead = () => async (dispatch, getState) => {
  try {
    const { notifications, auth } = getState();
    const unreadIds = notifications.notifications
      .filter((n) => !n.isRead)
      .map((n) => n._id);

    if (unreadIds.length === 0) return;

    // Optimistic update
    dispatch(markAllAsRead());

    await axios.patch(
      "/api/notifications/mark-all-read",
      { notificationIds: unreadIds },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    dispatch(setError(error.message || "Failed to mark all as read"));
    dispatch(fetchNotifications()); // Revert to server state
  }
};

// Thunk for marking single as read
export const markNotificationAsRead =
  (notificationId) => async (dispatch, getState) => {
    try {
      const { auth } = getState();

      // Optimistic update
      dispatch(
        updateNotification({
          _id: notificationId,
          isRead: true,
        })
      );

      await axios.patch(
        `/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      dispatch(setError(error.message));
      dispatch(fetchNotifications()); // Revert to server state
    }
  };

// Setup socket connection
export const setupNotificationSocket = () => (dispatch, getState) => {
  const { auth } = getState();

  // Validate auth data
  if (!auth.user?._id || !auth.token) {
    console.error("Cannot setup socket: Missing auth data");
    return;
  }

  // Don't create a new socket if one exists
  if (socket?.connected) {
    console.log("Socket already connected, reusing connection");
    return;
  }

  // Clean up any existing socket before creating a new one
  if (socket) {
    console.log("Cleaning up existing socket before reconnection");
    socket.disconnect();
    socket = null;
  }

  console.log("Setting up new notification socket connection");

  socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", {
    auth: {
      token: auth.token,
      userId: auth.user._id,
    },
    transports: ["websocket"], // Force WebSocket transport
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected with ID:", socket.id);
    dispatch(setSocketStatus(true));
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket.IO disconnected:", reason);
    dispatch(setSocketStatus(false));
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error);
    dispatch(setError(`Socket connection error: ${error.message}`));
  });

  socket.on("notification:new", (notification) => {
    console.log("New notification received:", notification);

    // Play sound or show browser notification
    if (Notification.permission === "granted") {
      new Notification("New notification", {
        body: notification.message,
      });
    }

    dispatch(addNotification(notification));
  });

  socket.on("notification:update", (notification) => {
    console.log("Notification update received:", notification);
    dispatch(updateNotification(notification));
  });
};

// Clean up socket connection
export const disconnectNotificationSocket = () => (dispatch) => {
  if (socket) {
    console.log("Disconnecting notification socket");
    socket.disconnect();
    socket = null;
    dispatch(setSocketStatus(false));
  }
};

// Request permission for browser notifications
export const requestNotificationPermission = () => () => {
  if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission();
  }
};

// Reconnect socket if auth state changes
export const checkAndReconnectSocket = () => (dispatch, getState) => {
  const { auth, notifications } = getState();

  if (auth.user?._id && auth.token && !notifications.socketConnected) {
    console.log("Auth state changed, reconnecting socket");
    dispatch(setupNotificationSocket());
  }
};
