import React, { createContext, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import * as SecureStore from "expo-secure-store";
const AxiosContext = createContext();
import { Platform } from "react-native";
import * as Device from "expo-device";

const { Provider } = AxiosContext;

const AxiosProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  function getBaseURL() {
    if (Platform.OS === "android") {
      const isEmulator = !Device.isDevice;
      console.log(isEmulator);
      return isEmulator ? "http://10.0.2.2:8000" : "http://localhost:8000";
    } else {
      return "http://localhost:8000";
    }
  }
  const baseURL = getBaseURL();

  const authAxios = axios.create({
    baseURL: baseURL,
  });

  const publicAxios = axios.create({
    baseURL: baseURL,
  });

  authAxios.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        console.log(authContext.getAccessToken());
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = (failedRequest) => {
    const data = {
      refreshToken: authContext.authState.refreshToken,
    };

    const options = {
      method: "POST",
      data,
      url: "http://10.0.2.2:8000/auth/refresh",
    };

    return axios(options)
      .then(async (tokenRefreshResponse) => {
        failedRequest.response.config.headers.Authorization =
          "Bearer " + tokenRefreshResponse.data.accessToken;

        authContext.setAuthState({
          ...authContext.authState,
          accessToken: tokenRefreshResponse.data.accessToken,
        });

        await SecureStore.setItemAsync(
          "accessToken",
          tokenRefreshResponse.data.accessToken
        );
        await SecureStore.setItemAsync(
          "refreshToken",
          tokenRefreshResponse.data.refreshToken
        );
        return Promise.resolve();
      })
      .catch((e) => {
        authContext.setAuthState({
          accessToken: null,
          refreshToken: null,
        });
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
      }}
    >
      {children}
    </Provider>
  );
};

export { AxiosContext, AxiosProvider };
