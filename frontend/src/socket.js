import { io } from "socket.io-client";

const socket = io("http://localhost:5050", {
    transports: ['websocket'],
  autoConnect: false, // do not connect immediately
});

export default socket;
