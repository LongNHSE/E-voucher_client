import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AxiosContext } from "../../context/AxiosContext";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../../components/Spinner";
import { LinearGradient } from "expo-linear-gradient";
import WaveBackground from "./../../components/WaveBackGround";
import * as SecureStore from "expo-secure-store";

const Login = () => {
  const navigator = useNavigation();
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const { publicAxios } = useContext(AxiosContext);

  const onLogin = async () => {
    setLoading(true);
    if (username === "" || password === "") {
      Alert.alert("Error", "Please fill all the fields");
      setLoading(false);
      return;
    }
    try {
      const response = await publicAxios.post("/auth/signin", {
        username,
        password,
      });
      console.log(response.data);
      const { token, refreshToken, user } = response.data;
      await SecureStore.setItemAsync("accessToken", token);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      const accessToken = token;
      authContext.setAuthState({
        accessToken,
        refreshToken,
        authenticated: true,
        user,
      });
      console.log(authContext.authState);
    } catch (error) {
      console.log(error);
      Alert.alert("Login Failed", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WaveBackground customStyles={styles.svgCurve}></WaveBackground>
      <Text style={styles.logo}>E-Voucher</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="black"
          keyboardType="default"
          autoCapitalize="none"
          onChangeText={(text) => setUserName(text)}
          value={username}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "green" }]}
        onPress={() => onLogin()}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "blue" }]}
        onPress={() => navigator.navigate("Signup")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {loading && <Spinner />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  svgCurve: {
    position: "absolute",
    width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    marginTop: 5,
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
    color: "black",
    paddingBottom: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  button: {
    width: "90%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
});

export default Login;
