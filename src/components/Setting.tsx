import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { AxiosContext } from "../context/AxiosContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const Setting = () => {
  const navigator = useNavigation();
  const { authAxios } = React.useContext(AxiosContext);
  const { authState, setAuthState } = React.useContext(AuthContext);
  const authContext = React.useContext(AuthContext);
  const logout = async () => {
    try {
      await authAxios.get("/auth/logout");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      console.log(SecureStore.getItemAsync("accessToken"));
      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
  },
});

export default Setting;
