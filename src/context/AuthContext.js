import React, { createContext, useContext, useReducer, useState } from "react";
import * as SecureStore from "expo-secure-store";
const AuthContext = createContext(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
    user: null,
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
      user: null,
    });
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  return (
    <Provider
      value={{
        authState,
        getAccessToken,
        setAuthState,
        logout,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthProvider, AuthContext };
