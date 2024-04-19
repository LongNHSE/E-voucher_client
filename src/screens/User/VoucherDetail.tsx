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

import { FontAwesome } from "@expo/vector-icons";
import ConfirmDialog from "../../components/ConfirmDialog";
import Voucher from "./Voucher";
import VoucherBottomSheet from "../../components/VoucherBottomSheet";

const VoucherDetail = ({ navigation }: any) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isGift, setIsGift] = useState<boolean>(false);
  const [amountVoucher, setAmountVoucher] = useState(1);

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
                style={{ width: 70, height: 70 }}
                source={require("../../../assets/favicon.png")}
              />

              <View style={styles.discountInfo}>
                <Text style={styles.discountText}>25% OFF</Text>
                <Text style={{ fontSize: 20 }}>KFC</Text>
              </View>
            </View>
            <View style={styles.voucherDes}>
              <Text style={styles.descriptionText}>
                Get 25% at your next KFC buy
              </Text>
              <View style={styles.conditionList}>
                <Text style={styles.conditionText}>{"\u2022 abcd"}</Text>
                <Text style={styles.conditionText}>{"\u2022 abcd"}</Text>
                <Text style={styles.conditionText}>{"\u2022 abcd"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.before}></View>
            <View style={styles.after}></View>
            <Text style={styles.price}>$30</Text>

            <View style={styles.buttonSection}>
              <TouchableOpacity onPress={() => setIsOpenDialog(true)}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Buy Now</Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => handleOpenDialog("gift")}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Gift Other</Text>
                </View>
              </TouchableOpacity> */}
            </View>
            <Text style={{ marginTop: 15 }}>Valid Until 16 July 23</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity style={styles.backContainer}>
            <FontAwesome name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {isOpenDialog ? (
        <VoucherBottomSheet
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          image={require("../../../assets/favicon.png")}
          voucherName={"abcdef"}
          price={50}
        />
      ) : (
        ""
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
    width: 342,
    height: 550,
    backgroundColor: "#FBFBFB",
    borderRadius: 12,
    paddingVertical: 30,
    marginTop: 80,
  },

  topSection: {
    paddingHorizontal: 30,
    flex: 1,
  },

  voucherInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  discountInfo: {},

  discountText: {
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 30, // Adjust line height as needed
  },

  voucherDes: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  conditionList: {
    gap: 10,
    fontWeight: "400",
    marginTop: 10,
  },

  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 30,
    // textAlign: "center",
  },

  conditionText: {
    fontSize: 16,
  },

  bottomSection: {
    flex: 0.6,
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

export default VoucherDetail;
