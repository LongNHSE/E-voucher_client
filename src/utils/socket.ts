import { io } from "socket.io-client";
import { getBaseURL } from "./appConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = getBaseURL();
const socket = io(`${url}`);

const setSocket = async () => {
  await AsyncStorage.setItem("socketId", JSON.stringify(socket.id));
};
setSocket();
export default socket;
