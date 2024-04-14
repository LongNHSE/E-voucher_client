import { View, Text, Button } from "native-base";
import React from "react";

const Login = ({ navigation }: any) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Login</Text>
      <Button
        rounded="full"
        bg="cyan.500"
        // variant="outline"
        _pressed={{ bg: "cyan.600" }}
        onPress={() => navigation.navigate("Signup")}
      >
        To sign up
      </Button>
    </View>
  );
};

export default Login;
