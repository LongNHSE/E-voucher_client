import { View, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as Camera from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";

interface Voucher {
  _id: string;
  voucherId: string;
  userId: string;
  giftUserId: string;
  status: string;
  genrateAt: string;
  description: string;
  price: number;
}
const voucher: Voucher = {
  _id: "662280a86a3084c6b6c44848",
  voucherId: "6620da842e9dead79a720606",
  userId: "66227c966a3084c6b6c44837",
  giftUserId: "",
  status: "pending",
  genrateAt: "2024-04-19T14:33:12.628+00:00",
  description: "",
  price: 0,
};
const QRCodeComponent = () => {
  const route = useRoute();
  //   const voucher: Voucher = route.params;

  console.log(voucher);
  return (
    <View style={styles.container}>
      <View style={styles.QRCode}>
        <QRCode
          value={JSON.stringify({
            voucher,
          })}
          size={200}
        ></QRCode>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    // semi-transparent black background
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  QRCode: {},
});
export default QRCodeComponent;
