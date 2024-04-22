import {
  View,
  Text,
  Icon,
  Button,
  useDisclose,
  Actionsheet,
} from "native-base";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { FontAwesome } from "@expo/vector-icons";
import ConfirmDialog from "../../components/ConfirmDialog";
import Voucher from "./Voucher";
import VoucherBottomSheet from "../../components/VoucherBottomSheet";
import moment from "moment";
import NotiDialog from "../../components/NotiDialog";
import QRCode from "react-native-qrcode-svg";
interface Voucher {
  _id: string;
  name: string;
  code: string;
  quantity: number;
  startUseTime: string;
  endUseTime: string;
  discount: number;
  discountType: string;
  price: number;
  status: string;
  startSellTime: string;
  endSellTime: string;
  description: string;
  imageUrl: string;
  condition: string[];
  host: string;
  staff: string;
  rejectReason: string;
  id: string;
}

interface VoucherSell {
  _id: string;
  voucherId: Voucher;
  userId: any;
  giftUserId: string | undefined;
  status: string;
  hash: string;
  generateAt: Date;
}

interface RO {
  statusCode: String;
  message: String;
  data: Voucher[];
}
const InventoryVoucherDetail = ({ navigation, route }: any) => {
  const voucherSell: VoucherSell = route.params.voucherSell;
  const voucher: Voucher = voucherSell.voucherId;
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenNotiDialog, setIsOpenNotiDialog] = useState<boolean>(false);
  const [isGift, setIsGift] = useState<boolean>(false);
  const [amountVoucher, setAmountVoucher] = useState(1);

  return (
    <>
      <StatusBar backgroundColor={"#004165"} />
      <View style={styles.container}>
        <View style={styles.ticketContainer}>
          <View style={styles.topSection}>
            <View style={styles.voucherInfo}>
              <Image
                style={{
                  width: 100,
                  height: 70,
                }}
                source={{ uri: voucher.imageUrl }}
              />

              <View style={styles.discountInfo}>
                <Text style={styles.discountText}>{voucher.discount}% OFF</Text>
                <Text style={{ fontSize: 20, width: 200 }} numberOfLines={2}>
                  {voucher.name}
                </Text>
              </View>
            </View>
            <View alignItems={"center"}>
              <View style={styles.voucherQR}>
                <View style={{ marginTop: 7, marginLeft: 7 }}>
                  <QRCode
                    value={JSON.stringify({
                      voucher_id: voucherSell._id,
                      hash: voucherSell.hash,
                    })}
                    size={235}
                  ></QRCode>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.before}></View>
            <View style={styles.after}></View>
            <Text style={styles.price}>{voucher.price} VND</Text>

            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400" }}>
              Valid Until {moment(voucher.endUseTime).format("Do MMM YY")}
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.backContainer}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {isOpenDialog && (
        <VoucherBottomSheet
          navigation={navigation}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          setIsOpenNotiDialog={setIsOpenNotiDialog}
          image={voucher.imageUrl}
          voucherName={voucher.name}
          price={voucher.price}
          voucherId={voucher._id}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004165",
    alignItems: "center",
  },

  ticketContainer: {
    width: 360,
    height: 600,
    backgroundColor: "#FBFBFB",
    borderRadius: 12,
    paddingVertical: 20,
    marginTop: 80,
  },

  topSection: {
    paddingHorizontal: 20,
    flex: 1,
  },

  voucherInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },

  discountInfo: {},

  discountText: {
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 30, // Adjust line height as needed
  },

  voucherQR: {
    marginTop: 20,
    // paddingHorizontal: 10,
    width: 250,
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#000000",
  },

  conditionList: {
    gap: 10,
    fontWeight: "400",
    marginTop: 10,
  },

  descriptionText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "auto",
  },

  conditionText: {
    fontSize: 16,
  },

  bottomSection: {
    flex: 0.45,
    marginTop: 10,
    borderTopWidth: 3,
    borderStyle: "dashed",
    position: "relative",
    marginHorizontal: 30,
    borderColor: "#66666633",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  before: {
    position: "absolute",
    top: -20,
    left: -50,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#004165",
  },

  after: {
    position: "absolute",
    top: -20,
    right: -50,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#004165",
  },

  price: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "600",
    marginRight: 7,
  },

  buttonSection: {
    alignItems: "center",
    gap: 10,
  },

  button: {
    width: 200,
    paddingVertical: 20,
    borderRadius: 100,
    backgroundColor: "#5BBCFF",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  backContainer: {
    marginTop: 50,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InventoryVoucherDetail;
