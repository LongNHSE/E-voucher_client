import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CarouselCard from "../components/CarouselCard";
import { Icon, Button, Image, ScrollView } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Signup from "./Authentication/Signup";

const data = [
  {
    title: "Manage Voucher",
    description: "Effortlessly sell, buy, and exchange vouchers",
    image: require("../../assets/image1.png"),
  },
  {
    title: "Easy Voucher Management",
    description:
      "Simplify the process of managing vouchers for hosts and customers",
    image: require("../../assets/image2.png"),
  },
  {
    title: "Simple voucher exchange",
    description: "Quickly exchange vouchers with other users using the app",
    image: require("../../assets/image3.png"),
  },
  {
    title: "Convenient User interface",
    description:
      "User-friendly interface that makes it easy to navigate through the app",
    image: require("../../assets/image4.png"),
  },
];

const Welcome = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* <ScrollView> */}
      <ImageBackground
        source={require("../../assets/welcome.jpg")}
        alt="background-image"
        resizeMode="cover"
        style={{
          height: "100%",
          width: "100%",
          alignSelf: "center",
          position: "absolute",
          zIndex: -1,
        }}
      />
      <Image
        source={require("../../assets/splash.png")}
        alt="logo"
        resizeMode="contain"
        style={{
          height: 150,
          width: 250,
          alignSelf: "center",
        }}
      />
      <CarouselCard data={data} />
      <View style={styles.buttonGroup}>
        <Button
          rounded="full"
          variant="solid"
          // _text={{ color: Colors.primaryMintDark }}
          _pressed={{ bg: "gray.500" }}
          bg={"black"}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>
        <Button
          // endIcon={<Icon as={Login} name="login-variant" size="lg" />}
          rounded="full"
          variant="outline"
          _text={{ color: "black" }}
          _pressed={{ bg: "gray.500" }}
          onPress={() => navigation.navigate("Signup")}
        >
          Signup
        </Button>
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    // marginVertical: 20,
    height: "100%",
  },
  buttonGroup: {
    height: 100,
    marginVertical: 40,
    marginHorizontal: 20,
    justifyContent: "space-between", // Add spacing between buttons
  },
});
