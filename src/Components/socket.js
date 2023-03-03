import io from "socket.io-client";
import { socketLink } from "../axiosInterceptor";
const socket = (userToken) => {
  if (userToken) {
    return io(socketLink, {
      extraHeaders: {
        token: userToken,
      },
    });
  }
};

export default socket;
