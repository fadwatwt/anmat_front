// services/socketService.js
import { RootRoute } from "@/Root.Route";
import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  if (socket) return socket;
  
  socket = io(RootRoute, {
    auth: {
      token: `Bearer ${token}`
    }
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const getSocket = () => {
  return socket;
};