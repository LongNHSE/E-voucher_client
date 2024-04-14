import { StatusBar } from "expo-status-bar";
import { Box, NativeBaseProvider, Text, View } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Login from "./src/screens/Authentication/Login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <Box safeArea />
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "", animation: "slide_from_right" }}
          />
          {/* Other component goes here */}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
