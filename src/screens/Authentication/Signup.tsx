import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Button,
} from "react-native";
import { useContext, useRef, useState } from "react";
import { Button as NativeButton } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { AxiosContext } from "../../context/AxiosContext";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import React from "react";
import OTPTextView from "react-native-otp-textinput";
import Spinner from "../../components/Spinner";
import WaveBackgroundSignUp from "../../components/WaveBackGroundSignUp";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { AuthContext } from "../../context/AuthContext";
import * as SecureStore from "expo-secure-store";
const Signup = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const { publicAxios } = useContext(AxiosContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  let input = useRef("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const onChange = (event: Event, selectedDate: Date) => {
    setShowDatePicker(false);
    const currentDate = selectedDate;
    setDateOfBirth(currentDate);
    console.log(currentDate);
  };

  const handleEmail = async () => {
    setLoading(true);
    try {
      const response = await publicAxios.post("/auth/sendOTP", {
        email,
      });
      setStep("otp");
    } catch (error: Error | any) {
      console.log(error);
      Alert.alert("Error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async () => {
    try {
      const response = await publicAxios.post("/auth/verifyOTP", {
        mail: email,
        OTP: otp,
      });
      setStep("signUp");
    } catch (error: Error | any) {
      console.log(error);
      Alert.alert("Error", error.response.data.message);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (!dateOfBirth) {
      Alert.alert("Error", "Please select date of birth");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await publicAxios.post("/auth/signup", {
        email,
        password: password,
        username: username,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        phone: phone,
      });
      Alert.alert("Success", "Account created successfully");
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
      // navigation.goBack();
    } catch (error: Error | any) {
      console.log(error);
      Alert.alert("Error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <SafeAreaView style={styles.container}>
        <WaveBackgroundSignUp
          customStyles={styles.svgCurve}
        ></WaveBackgroundSignUp>
        <Text style={styles.logo}>Sign Up</Text>
        <TouchableOpacity
          style={{ position: "absolute", left: 20, top: 20 }} // Add this style
        >
          <Feather
            name="arrow-left-circle"
            size={40}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="black"
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={() => handleEmail()}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        {loading && <Spinner />}
      </SafeAreaView>
    );
  }

  if (step === "otp") {
    return (
      <SafeAreaView style={styles.container}>
        <WaveBackgroundSignUp
          customStyles={styles.svgCurve}
        ></WaveBackgroundSignUp>
        <TouchableOpacity
          style={{ position: "absolute", left: 20, top: 20 }} // Add this style
        >
          <Feather
            name="arrow-left-circle"
            size={40}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <Text style={styles.logo}>Sign Up</Text>
        <View style={styles.form}>
          <OTPTextView
            ref={input}
            offTintColor="black"
            textInputStyle={[
              styles.input,
              {
                color: "black",
                borderBottomColor: "black",
                borderBottomWidth: 1,
              },
            ]}
            inputCount={6}
            handleTextChange={setOtp}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={() => handleOtp()}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        {loading && <Spinner />}
      </SafeAreaView>
    );
  }

  if (step === "signUp") {
    return (
      <SafeAreaView style={styles.container}>
        <WaveBackgroundSignUp
          customStyles={styles.svgCurve}
        ></WaveBackgroundSignUp>
        <TouchableOpacity
          style={{ position: "absolute", left: 20, top: 20 }} // Add this style
        >
          <Feather
            name="arrow-left-circle"
            size={40}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <Text style={styles.logo}>Sign Up</Text>
        <View style={styles.form}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]} // add marginRight
              placeholder="First Name"
              placeholderTextColor="black"
              keyboardType="default"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholderTextColor="black"
              autoCapitalize="none"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="black"
            keyboardType="default"
            value={username}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize="none"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.input, { width: "100%" }]}>
              {dateOfBirth
                ? dateOfBirth.toLocaleDateString()
                : "Select Date of Birth"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{ position: "absolute", right: 0, top: 25 }}
            >
              <AntDesign name="downcircleo" size={24} color="black" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onChange}
              />
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor="black"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="Confirm Password"
            placeholderTextColor="black"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="black"
            value={phone}
            onChangeText={(text) => {
              // Remove any non-numeric characters
              const numericText = text.replace(/[^0-9]/g, "");
              setPhone(numericText);
            }}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                !firstName ||
                !lastName ||
                !username ||
                !password ||
                !phone ||
                !dateOfBirth
                  ? "gray"
                  : "green",
            },
          ]}
          onPress={() => handleSignUp()}
          disabled={
            !firstName ||
            !lastName ||
            !username ||
            !password ||
            !phone ||
            !dateOfBirth
          }
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {loading && <Spinner />}
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  svgCurve: {
    position: "absolute",
    width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  logo: {
    fontSize: 50,
    color: "#fff",
    margin: "10%",
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
    marginVertical: 20,
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
export default Signup;
