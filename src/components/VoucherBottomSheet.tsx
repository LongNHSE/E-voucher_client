import { View, Text, AlertDialog, Actionsheet, Divider } from "native-base";

import { Button, RadioButton } from "react-native-paper";

import React, { useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import { PaymentMethod } from "../constants/PaymentMethod";

const VoucherBottomSheet = ({
  navigation,
  isOpenDialog,
  setIsOpenDialog,
  title,
  message,
  image,
  voucherName,
  price,
}: any) => {
  const [amount, setAmount] = useState<number>(1);
  const [checked, setChecked] = useState("VNPay");
  const [email, setEmail] = useState("");
  const [isGift, setIsGift] = useState<boolean>(false);

  const onChangeAmount = (choice: string) => {
    if (choice === "minus") {
      setAmount(amount - 1);
    } else if (choice === "plus") {
      setAmount(amount + 1);
    }
  };

  return (
    <View>
      <Actionsheet isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <Actionsheet.Content>
          <View style={styles.voucherInfor}>
            <Image style={{ width: 70, height: 70 }} source={image} />
            <View>
              <Text style={{ fontSize: 18, fontWeight: "400" }}>
                {voucherName}
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: "500", marginTop: 10 }}
              >{`$${price}`}</Text>
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
                    paddingLeft: 31,
                  }}
                />
                <Button mode="text" onPress={() => onChangeAmount("plus")}>
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

            <TouchableOpacity style={styles.button}>
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
