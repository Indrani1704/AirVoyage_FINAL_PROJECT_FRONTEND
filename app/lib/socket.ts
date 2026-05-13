import { io } from "socket.io-client";

const socket = io(
  "https://airvoyage-final-project-backend-2.onrender.com",
  {
    transports: ["websocket"],
  }
);

export default socket;