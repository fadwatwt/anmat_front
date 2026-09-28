// services/socketService.js
import { RootRoute } from "@/Root.Route";
import { io } from "socket.io-client";

let socket;
let activeToken;

export const initSocket = (token) => {
  if (socket && activeToken === token) return socket;
  if (socket) socket.disconnect();
  activeToken = token;
  
  const baseUrl = RootRoute || "http://localhost:3000";
  // The report specifies /chat namespace
  socket = io(`${baseUrl}/chat`, {
    auth: {
      token: token
    },
    transports: ["websocket"] // Preferred for real-time
  });
  
  socket.on("connect", () => {
    console.log("📡 [Socket] Connected to /chat namespace");
  });

  socket.on("connect_error", (err) => {
    console.error("📡 [Socket] Connection error:", err.message);
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  activeToken = null;
};

export const getSocket = () => {
  return socket;
};
