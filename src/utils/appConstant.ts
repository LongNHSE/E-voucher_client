import { Platform } from "react-native";
import * as Device from "expo-device";

export const baseUrl: String = "http://10.0.2.2:8000";
// export const baseUrl: String = "http://localhost:8000";
export function getBaseURL() {
  if (Platform.OS === "android") {
    const isEmulator = !Device.isDevice;
    console.log(isEmulator);
    return isEmulator ? "http://10.0.2.2:8000" : "http://localhost:8000";
  } else {
    return "http://localhost:8000";
  }
}
