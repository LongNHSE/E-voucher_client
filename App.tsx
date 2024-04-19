import { StatusBar } from "expo-status-bar";
import { Box, NativeBaseProvider, Text, View } from "native-base";
import Navigation from "./src/layouts/Navigation";
import VoucherDetail from "./src/screens/User/VoucherDetail";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Login from "./src/screens/Authentication/Login";
// import Home from "./src/screens/Home";
// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <Box safeArea />
      <StatusBar style="auto" />
      {/* <Navigation /> */}
      <VoucherDetail />
    </NativeBaseProvider>
  );
}
