import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import { StyleSheet } from "react-native";
import { AxiosContext } from "../../context/AxiosContext";
import { useIsFocused } from "@react-navigation/native";
import { AlertDialog } from "native-base";
import NotiDialog from "../../components/NotiDialog";

const Payment = ({ route, navigation }: any) => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const link = route.params.url;

  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenSuccessDialog, setIsOpenSuccessDialog] =
    useState<boolean>(false);
  const voucherId = route.params.voucherId;
  // const transactionId = route.params.transactionId?.replace(/-/g, "");
  const quantity = route.params.amount;
  const userId = route.params.userId;
  const giftUserId = route.params.giftUserId;
  const { authAxios, publicAxios } = useContext(AxiosContext);

  const createInvoice = async (userId, voucherId, quantity, giftUserId) => {
    try {
      const res = await publicAxios.post(`/invoices`, {
        userId,
        quantity,
        voucherId,
        giftUserId,
      });
      console.log("---------------create invoice", res.data);

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const checkPaidVNPay = async (queryParams) => {
    try {
      const result = await publicAxios.post(
        `/vnpay/get-payment?${queryParams}`
      );
      console.log("----get-payment", result.data);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleNormalPaymentStatus = async (paymentMethod, orderData) => {
    setIsLoading(true);

    if (paymentMethod === "VNPay") {
      try {
        const {
          vnp_Amount,
          vnp_BankCode,
          vnp_BankTranNo,
          vnp_CardType,
          vnp_OrderInfo,
          vnp_PayDate,
          vnp_ResponseCode,
          vnp_TmnCode,
          vnp_TransactionNo,
          vnp_TransactionStatus,
          vnp_TxnRef,
          vnp_SecureHash,
        } = orderData;
        const queryParams = `vnp_Amount=${vnp_Amount}&vnp_BankCode=${vnp_BankCode}&vnp_BankTranNo=${vnp_BankTranNo}&vnp_CardType=${vnp_CardType}&vnp_OrderInfo=${encodeURIComponent(
          vnp_OrderInfo
        )}&vnp_PayDate=${vnp_PayDate}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_TmnCode=${vnp_TmnCode}&vnp_TransactionNo=${vnp_TransactionNo}&vnp_TransactionStatus=${vnp_TransactionStatus}&vnp_TxnRef=${vnp_TxnRef}&vnp_SecureHash=${vnp_SecureHash}`;
        checkPaidVNPay(queryParams).then((res) => {
          console.log("1111111111", res.status, res.data);
          if (res.status >= 200 && res.status < 300) {
            createInvoice(userId, voucherId, quantity, giftUserId).then(
              (res) => {
                if (res.status >= 200 && res.status < 300) {
                  setIsLoading(false);
                  console.log("000000000", res.status, res.data);
                  setIsOpenSuccessDialog(true);
                  // navigation.navigate("Inventory");
                }
              }
            );
          }
        });
      } catch (error) {
        setIsLoading(false);
        setIsOpenDialog(true);
        console.log(error);
      }
    }
  };

  const handleDeepLink = (event) => {
    const data = Linking.parse(event.url);
    console.log("--------deeplink", data.queryParams.vnp_ResponseCode);
    if (
      data?.queryParams &&
      data.queryParams["vnp_TransactionStatus"] === "00"
    ) {
      handleNormalPaymentStatus("VNPay", data.queryParams);
    }
    // Failed.
    if (
      data.queryParams["message"] == "Transaction denied by user." ||
      data.queryParams["vnp_ResponseCode"] == "24"
    ) {
      setIsOpenDialog(true);
    }
  };

  const isFocus = useIsFocused();

  const [renderTime, setRenderTime] = useState(0);
  useEffect(() => {
    if (renderTime === 0) Linking.addEventListener("url", handleDeepLink);
    setRenderTime(renderTime + 1);
  }, [isFocus]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Payment</Text>

      <View style={styles.normalPaymentContainer}>
        <Text style={styles.paymentMethodText}>
          You will be redirect to VNPAY gateway to pay your order
        </Text>
        <Button
          title="Pay Now"
          onPress={() => WebBrowser.openBrowserAsync(link)}
        />
      </View>
      {isOpenDialog && (
        <NotiDialog
          navigateFunc={() => navigation.goBack()}
          navigation={navigation}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          title={"Alert"}
          message={"Payment is failed. Please try again."}
        />
      )}
      {isOpenSuccessDialog && (
        <NotiDialog
          navigateFunc={() => navigation.navigate("Inventory")}
          navigation={navigation}
          isOpenDialog={isOpenSuccessDialog}
          setIsOpenDialog={setIsOpenSuccessDialog}
          title={"Success"}
          message={"Payment successfully. You will be redirect to Inventory."}
        />
      )}
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  normalPaymentContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    margin: 10,
    borderRadius: 10,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
