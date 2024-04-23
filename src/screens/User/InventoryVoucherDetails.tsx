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
import { Feather } from "@expo/vector-icons";

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

  console.log(voucherSell);

  const handleOpenDialog = (check) => {
    if (check === "gift") {
      setIsGift(true);
      setIsOpenDialog(true);
    } else {
      setIsGift(false);
      setIsOpenDialog(true);
    }
  };

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
                source={{ uri: voucher?.imageUrl }}
              />

              <View style={styles.discountInfo}>
                <Text style={styles.discountText}>
                  {voucher.discount}
                  <Text>
                    {voucher.discountType === "percentage" ? "% OFF" : "K OFF"}
                  </Text>
                </Text>
                <Text style={{ fontSize: 20, width: 180 }}>{voucher.name}</Text>
              </View>
            </View>
            <View style={styles.voucherDes}>
              <Text style={styles.descriptionText}>{voucher.description}</Text>
              <Text style={{ fontSize: 20, fontWeight: "500", marginTop: 15 }}>
                Condition:{" "}
              </Text>
              <View style={styles.conditionList}>
                {voucher?.condition?.map((data, index) => {
                  return (
                    <View key={index} style={{ flexDirection: "row", gap: 2 }}>
                      <Text>{"\u2022"}</Text>

                      <Text style={styles.conditionText}>{` ${data}`}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.before}></View>
            <View style={styles.after}></View>
            <Text style={styles.price}>{voucher.price} VND</Text>

            <View style={styles.buttonSection}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("QR", { voucherSell: voucherSell });
                }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Use now</Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => handleOpenDialog("gift")}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Gift Other</Text>
                </View>
              </TouchableOpacity> */}
            </View>
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400" }}>
              Sell From {moment(voucher.startSellTime).format("Do MMM YY")} -{" "}
              {moment(voucher.endSellTime).format("Do MMM YY")}
            </Text>

            <Text style={{ marginTop: -10, fontSize: 16, fontWeight: "400" }}>
              Valid From {moment(voucher.startUseTime).format("Do MMM YY")} -{" "}
              {moment(voucher.endUseTime).format("Do MMM YY")}
            </Text>
          </View>

          <TouchableOpacity
            style={{ position: "absolute", right: 10, top: 18 }}
            onPress={() =>
              navigation.navigate("UserReport", {
                voucherId: voucher._id,
                voucherSellId: voucherSell._id,
              })
            }
          >
            <Feather name="flag" size={28} color="red" />
          </TouchableOpacity>
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

      {isOpenNotiDialog && (
        <NotiDialog
          navigation={navigation}
          isOpenDialog={isOpenNotiDialog}
          setIsOpenDialog={setIsOpenNotiDialog}
          title={"Alert"}
          message={"You must login before buy or gift voucher"}
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
    height: 630,
    backgroundColor: "#FBFBFB",
    borderRadius: 12,
    paddingVertical: 20,
    marginTop: 50,
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

  voucherDes: {
    marginTop: 30,
    paddingHorizontal: 10,
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
