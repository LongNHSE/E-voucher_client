import React from "react";
import { StyleSheet } from "react-native";
import { AxiosContext } from "../context/AxiosContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  Button,
  Heading,
  Icon,
  Image,
  ScrollView,
  Text,
  View,
} from "native-base";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";

const Setting = () => {
  const navigator = useNavigation();
  const { authAxios } = React.useContext(AxiosContext);
  const authContext: any = React.useContext(AuthContext);
  const logout = async () => {
    await authContext.logout();

    try {
      await authAxios.get("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
    }
  };
  return (
    <ScrollView>
      <Image
        source={require("../../assets/background.png")}
        alt="logo"
        style={{ width: 400, height: 200 }}
      />
      <Image
        source={require("../../assets/user.png")}
        alt="logo"
        style={{ width: 150, height: 150 }}
        backgroundColor={"white"}
        borderRadius="full"
        marginTop={-75}
        marginLeft={125}
      />
      <Heading textAlign="center">
        {authContext.authState.user.username}
      </Heading>
      <Text textAlign="center" fontSize="lg">
        {authContext.authState.user.firstName +
          " " +
          authContext.authState.user.lastName}
      </Text>
      <View
        marginX={5}
        marginY={2}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
      >
        <Icon
          as={MaterialCommunityIcons}
          name="email-open-outline"
          size="lg"
          color={"black"}
          marginRight={10}
        />
        <Text fontSize="lg">{authContext.authState.user.email}</Text>
      </View>
      <View
        marginX={5}
        marginY={2}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
      >
        <Icon
          as={Feather}
          name="phone"
          size="lg"
          color={"black"}
          marginRight={10}
        />
        <Text fontSize="lg">{authContext.authState.user.phone}</Text>
      </View>
      <View
        marginX={5}
        marginY={2}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
      >
        <Icon
          as={FontAwesome5}
          name="user-tie"
          size="lg"
          color={"black"}
          marginRight={10}
        />
        <Text fontSize="lg">{authContext.authState.user.role}</Text>
      </View>
      <Button
        marginX={5}
        marginY={5}
        onPress={() => logout()}
        bg={"black"}
        variant="solid"
        rounded={"full"}
        _pressed={{ bg: "gray.500" }}
        rightIcon={
          <Icon as={MaterialIcons} name="logout" size="md" color={"white"} />
        }
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Setting;
