import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AxiosContext } from "../../context/AxiosContext";

const Login = () => {
  const [username, setUserName] = useState("");

  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const { publicAxios } = useContext(AxiosContext);

  const onLogin = async () => {
    console.log(username, password);
    try {
      const response = await publicAxios.post("/auth/signin", {
        username,
        password,
      });

      const { token, refreshToken } = response.data;
      const accessToken = token;
      authContext.setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
      });
    } catch (error) {
      Alert.alert("Login Failed", error.response.data.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>E-Voucher</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fefefe"
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={(text) => setUserName(text)}
          value={username}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fefefe"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <Button title="Login" style={styles.button} onPress={() => onLogin()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  logo: {
    fontSize: 50,
    color: "#fff",
    margin: "20%",
  },
  form: {
    width: "80%",
    margin: "10%",
  },
  input: {
    fontSize: 20,
    color: "#fff",
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  button: {},
});

export default Login;
