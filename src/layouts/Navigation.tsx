import React, { useState, useContext, useEffect, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../src/screens/Home";
import Login from "../../src/screens/Authentication/Login";
import { NavigationContainer } from "@react-navigation/native";
import Signup from "../screens/Authentication/Signup";
import UserTab from "../screens/User/UserTab";
import VoucherDetail from "../screens/User/VoucherDetail";
import StaffTab from "../screens/Staff/StaffTab";
import ReportDetail from "../screens/Staff/ReportDetail";
import RequestVoucherDetail from "../screens/Staff/RequestVoucherDetail";
import HostTab from "../screens/Host/HostTab";
import VoucherHostDetail from "../screens/Host/VoucherHostDetail";
import { VoucherCreation } from "../screens/Host/VoucherCreation";
import { AxiosContext } from "../context/AxiosContext";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import Voucher from "../screens/User/Voucher";
import VNPayWebView from "../screens/User/VNPayWebView";
import InventoryVoucherDetail from "../screens/User/InventoryVoucherDetails";
import QR from "../screens/User/QR";
import * as Linking from "expo-linking";

const Stack: any = createNativeStackNavigator();

const prefix = Linking.createURL("/");

const Navigation = () => {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Login: "login",
      },
    },
  };

  console.log("prefix", prefix);

  const [status, setStatus] = useState<string>("loading");
  const authContext = useContext(AuthContext);
  const loadJWT = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const user = await SecureStore.getItemAsync("user");
      // console.log("loading jwt");
      console.log(accessToken, refreshToken, user);
      const jwt = {
        accessToken,
        refreshToken,
      };
      authContext.setAuthState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null,
        user: user ? JSON.parse(user) : null,
      });
      // console.log("loading jwt");
      // console.log(authContext.authState.authenticated);
      console.log(authContext.authState);
      setStatus("success");
    } catch (error: Error | any) {
      setStatus("error");
      console.log("error", error.message);
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
        user: null,
      });
    } finally {
      setStatus("success");
    }
  }, []);

  const getIntialRoute = () => {
    if (authContext?.authState?.authenticated === false) {
      return "Login";
    } else {
      if (authContext?.authState?.user?.role === "staff") {
        return "StaffTab";
      } else if (authContext?.authState?.user?.role === "user") {
        return "UserTab";
      } else if (authContext?.authState?.user?.role === "admin") {
        return "AdminTab";
      } else if (authContext?.authState?.user?.role === "host") {
        return "HostTab";
      }
    }
  };

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === "loading") return <></>;

  return (
    <NavigationContainer linking={linking}>
      {authContext?.authState?.authenticated === false ? (
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
              headerShown: false,
              title: "",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              title: "",
              animation: "slide_from_right",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName={getIntialRoute()}>
          {authContext?.authState?.user?.role === "user" ? (
            <Stack.Screen
              name="UserTab"
              component={UserTab}
              options={{ headerShown: false }}
            />
          ) : null}

          {authContext?.authState?.user?.role === "staff" ? (
            <Stack.Screen
              name="StaffTab"
              component={StaffTab}
              options={{ headerShown: false }}
            />
          ) : null}

          {authContext?.authState?.user?.role === "host" ? (
            <Stack.Screen
              name="HostTab"
              component={HostTab}
              options={{ headerShown: false }}
            />
          ) : null}

          <Stack.Screen
            name="VoucherDetail"
            component={VoucherDetail}
            options={{
              headerShown: false,
              title: "Voucher Detail",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="InventoryVoucherDetail"
            component={InventoryVoucherDetail}
            options={{
              headerShown: false,
              title: "VInventoryVoucherDetail",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="QR"
            component={QR}
            options={{ title: "QR", animation: "slide_from_right" }}
          />

          <Stack.Screen
            name="VNPay"
            component={VNPayWebView}
            options={{
              headerShown: false,
              title: "VNPayl",
              animation: "slide_from_right",
            }}
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
          {/* Host */}

          <Stack.Screen
            name="VoucherHostDetail"
            component={VoucherHostDetail}
            options={{ title: "Voucher Detail", animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="VoucherCreation"
            component={VoucherCreation}
            options={{ title: "Voucher Create", animation: "slide_from_right" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
