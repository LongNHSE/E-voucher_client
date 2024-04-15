import React, { useState, useContext, useEffect, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../src/screens/Home";
import Login from "../../src/screens/Authentication/Login";
import { NavigationContainer } from "@react-navigation/native";
import Signup from "../screens/Authentication/Signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserTab from "../screens/User/UserTab";
import { AxiosContext } from "../context/AxiosContext";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";

const Stack: any = createNativeStackNavigator();

const Navigation = () => {
  const [token, setToken] = useState<string>("sada");
  const [status, setStatus] = useState<string>("loading");
  const authContext = useContext(AuthContext);
  const loadJWT = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const jwt = {
        accessToken,
        refreshToken,
      };
      authContext.setAuthState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null,
      });
      console.log(authContext.authState);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      console.log("error", error.message);
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);
  return (
    <NavigationContainer>
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
        <Stack.Navigator initialRouteName="UserTab">
          <Stack.Screen
            name="UserTab"
            component={UserTab}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
