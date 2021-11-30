import io from "socket.io-client";
import { signOutUtil } from "@/utils";

const socket = io(process.env.VUE_APP_DATA_API_SOCKETIO_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

socket.on("connect", () => {
  console.log("connected. socket.id:", socket.id);
});

socket.on("connect_error", (err: { message: string }) => {
  console.error("err.message", err.message);
  if (err && err.message && err.message.includes("Unauthorized")) {
    signOutUtil();
  }
});

export default socket;
