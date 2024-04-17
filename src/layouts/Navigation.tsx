import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../src/screens/Home";
import Login from "../../src/screens/Authentication/Login";
import { NavigationContainer } from "@react-navigation/native";
import Signup from "../screens/Authentication/Signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserTab from "../screens/User/UserTab";
import StaffTab from "../screens/Staff/StaffTab";
import ReportDetail from "../screens/Staff/ReportDetail";
import RequestVoucherDetail from "../screens/Staff/RequestVoucherDetail";

const Stack: any = createNativeStackNavigator();

const Navigation = () => {
  const [token, setToken] = useState<string>("sada");
  //   const getToken = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     return token || "";
  //   };
  return (
    <NavigationContainer>
      {token === "" ? (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            animation: "default",
          }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            headerBackTitleVisible={true}
            options={{
              title: "",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ title: "", animation: "slide_from_right" }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="StaffTab">
          <Stack.Screen
            name="UserTab"
            component={UserTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StaffTab"
            component={StaffTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportDetail"
            component={ReportDetail}
            options={{ title: "Report Detail", animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="RequestVoucherDetail"
            component={RequestVoucherDetail}
            options={{ title: "Voucher Detail", animation: "slide_from_right" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
