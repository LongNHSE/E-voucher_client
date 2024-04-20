import { View, Text } from "native-base";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
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
const GiftVoucher = () => {
  const route = useRoute();
  const voucher: Voucher = route.params;
  console.log(voucher);
  return (
    <View style={styles.container}>
      <View style={styles.QRCode}>
        <QRCode
          value={JSON.stringify({
            voucher,
          })}
          size={400}
        ></QRCode>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    // semi-transparent black background
  },
  QRCode: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
  },
});
export default GiftVoucher;
