import { View, Text, Icon, Button } from "native-base";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const Home = ({ navigation }: any) => {
  const handleLogout = () => {
    navigation.navigate("Login");
  };
  return (
    <View className="flex-1 justify-center items-center">
      <Icon as={AntDesign} name="home" color="amber.800" size={10} />
      <Text>Home</Text>
      <Button
        rounded="full"
        bg="cyan.500"
        // variant="outline"
        _pressed={{ bg: "cyan.600" }}
        endIcon={<Icon as={AntDesign} name="arrowright" size={5} />}
        onPress={handleLogout}
      >
        Go to Login
      </Button>
    </View>
  );
};

export default Home;
