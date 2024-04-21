import { View, Text, AlertDialog, Actionsheet, Divider } from "native-base";

import { Button, RadioButton } from "react-native-paper";

import React, { useContext, useState } from "react";

import * as SecureStore from "expo-secure-store";

import * as WebBrowser from "expo-web-browser";

import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import { PaymentMethod } from "../constants/PaymentMethod";
import { AxiosContext } from "../context/AxiosContext";

const VoucherBottomSheet = ({
  navigation,
  isOpenDialog,
  setIsOpenDialog,
  setIsOpenNotiDialog,
  title,
  message,
  image,
  voucherName,
  price,
  quantity,
  voucherId,
  redirectUri,
}: any) => {
  const [amount, setAmount] = useState<number>(1);
  const [checked, setChecked] = useState<string>("VNPay");
  const [email, setEmail] = useState<string>("");
  const [paymentURL, setPaymentURl] = useState<string>("");
  const [isGift, setIsGift] = useState<boolean>(false);
  const { authAxios, publicAxios } = useContext(AxiosContext);

  const onChangeAmount = (choice: string) => {
    if (choice === "minus") {
      setAmount(amount - 1);
    } else if (choice === "plus") {
      setAmount(amount + 1);
    }
  };

  const handlePurchase = async (total: number) => {
    let storedUser = await SecureStore.getItem("user");

    const userData = JSON.parse(storedUser);

    let userId = "66227c966a3084c6b6c44837";

    let giftUserId = "";

    try {
      if (!storedUser) {
        setIsOpenDialog(false);
        setIsOpenNotiDialog(true);
        return;
      }

      if (isGift) {
        const response = await authAxios.get(`/users/email/${email}`);
        console.log("response", response.data);
        userId = response.data._id;
        giftUserId = userData._id;

        // const responsePurchase = await authAxios.post(`/invoices`, {
        //   userId,
        //   quantity: amount,
        //   voucherId,
        //   giftUserId,
        // });

        // return;
      }

      // const response = await authAxios.post(`/invoices`, {
      //   userId,
      //   quantity: amount,
      //   voucherId,
      // });

      const url = await authAxios.post(`/vnpay/create-payment`, {
        total,
        bankcode: "",
        voucherId,
        redirectUri,
      });

      console.log(url.data);

      await WebBrowser.openBrowserAsync(url.data);

      // navigation.navigate("VNPay", {
      //   paymentURL: url.data,
      // });
    } catch (error) {
      console.log(error);
    }

    const response = await authAxios.post("/invoice", {});
  };

  return (
    <View>
      <Actionsheet isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <Actionsheet.Content>
          <View style={styles.voucherInfor}>
            <Image style={{ width: 70, height: 70 }} source={{ uri: image }} />
            <View>
              <Text style={{ fontSize: 18, fontWeight: "400" }}>
                {voucherName}
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: "500", marginTop: 10 }}
              >{`${price} VND`}</Text>

              <Text style={{ fontSize: 18, fontWeight: "400", marginTop: 10 }}>
                {quantity} vouchers left
              </Text>
            </View>
          </View>
          <Divider borderColor="black" />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.chooseSection}>
              <Text style={[styles.title, { marginBottom: 15 }]}>
                Buy or Gift
              </Text>

              <View style={styles.chooseButtonSection}>
                <TouchableOpacity
                  style={
                    !isGift ? styles.chooseButton : styles.chooseButtonActive
                  }
                  onPress={() => setIsGift(true)}
                >
                  <Text style={styles.chooseButtonText}>Gift</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    isGift ? styles.chooseButton : styles.chooseButtonActive
                  }
                  onPress={() => setIsGift(false)}
                >
                  <Text style={styles.chooseButtonText}>Buy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Divider borderColor="black" />

            <View style={styles.giftInfor}>
              <Text style={[styles.title, { marginBottom: 15 }]}>
                Gift Information (For Gifting Only)
              </Text>
              <TextInput
                editable={isGift}
                placeholder="Email Of Receiver"
                value={email}
                onChangeText={(value) => setEmail(value)}
                style={
                  isGift
                    ? {
                        borderWidth: 0.5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }
                    : {
                        borderWidth: 0.5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: "#f0f0f0",
                        color: "grey",
                      }
                }
              />
            </View>

            <Divider borderColor="black" />

            <View style={styles.amountSection}>
              <Text style={styles.title}>Amount: </Text>
              <View style={styles.inputField}>
                <Button
                  disabled={amount === 1}
                  mode="text"
                  onPress={() => onChangeAmount("minus")}
                >
                  <Entypo name="minus" size={18} color="black" />{" "}
                </Button>
                <TextInput
                  keyboardType="numeric"
                  value={amount.toString()}
                  onChangeText={(value) => setAmount(parseInt(value))}
                  style={{
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    width: 70,
                    borderColor: "grey",
                    textAlign: "center",
                  }}
                />
                <Button
                  disabled={amount === quantity}
                  mode="text"
                  onPress={() => onChangeAmount("plus")}
                >
                  <Entypo name="plus" size={18} color="black" />{" "}
                </Button>
              </View>
            </View>
            <Divider borderColor="black" />

            <View style={styles.paymentMethod}>
              <Text style={[styles.title, { marginBottom: 15 }]}>
                Payment Method:
              </Text>
              {PaymentMethod.map((item) => {
                return (
                  <View style={styles.paymentItem} key={item.id}>
                    <View style={styles.paymentLeft}>
                      <Image
                        source={item.image}
                        style={{ width: 40, height: 40 }}
                      />
                      <Text style={styles.paymentName}>{item.name}</Text>
                    </View>
                    <View style={styles.paymentRight}>
                      <RadioButton
                        value={item.name}
                        status={checked === item.name ? "checked" : "unchecked"}
                        onPress={() => setChecked(item.name)}
                        disabled={item.status === false}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <Divider borderColor="black" />
          <View style={styles.totalSection}>
            <Text style={styles.title}>
              Total:{" "}
              <Text style={{ fontWeight: "400" }}>{price * amount}$</Text>
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePurchase(price * amount)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
  },

  chooseSection: {
    padding: 30,
    width: "100%",
  },

  chooseButtonSection: {
    flexDirection: "row",
    gap: 30,
  },

  chooseButton: {
    width: 150,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
  },

  chooseButtonActive: {
    width: 150,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#5BBCFF",
  },

  chooseButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },

  giftInfor: {
    padding: 30,
    width: "100%",
    position: "relative",
  },

  voucherInfor: {
    flexDirection: "row",
    gap: 30,
    width: "100%",
    padding: 30,
  },

  amountSection: {
    padding: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  inputField: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "grey",
  },

  paymentMethod: {
    width: "100%",
    padding: 30,
    gap: 20,
  },

  paymentItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  paymentName: {
    fontSize: 16,
  },

  paymentRight: {},

  totalSection: {
    padding: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  button: {
    width: 150,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5BBCFF",
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default VoucherBottomSheet;
