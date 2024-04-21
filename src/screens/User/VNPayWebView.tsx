import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const VNPayWebView = ({ route }) => {
  const { paymentURL } = route.params;

  console.log("Payment URL type:", typeof paymentURL);

  const handleNavigationStateChange = (navState) => {
    console.log("Navigation State Change:", navState);
  };

  const shouldStartLoadWithRequest = (navState) => {
    return navState.url.startsWith("https://sandbox.vnpayment.vn");
  };

  const onMessage = (data) => {
    console.log("onMassage", data.nativeEvent.data);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" />
      {paymentURL && (
        <WebView
          source={{ uri: paymentURL }}
          onMessage={onMessage}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={shouldStartLoadWithRequest} // Ensuring we are only loading certain requests
          javaScriptEnabled={true} // Enable JavaScript if needed
          domStorageEnabled={true} // Enable DOM Storage if needed
          startInLoadingState={true} // Show a loading indicator while content is loading
        />
      )}
    </View>
  );
};

export default VNPayWebView;
