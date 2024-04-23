import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  Image,
  Center,
  Button,
  Select,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { TextInput } from "react-native-paper";
import { baseUrl } from "../../utils/appConstant";
import voucherPlaceholder from "../../../assets/icon.png";
import { Ionicons } from "@expo/vector-icons";
import { green100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import * as SecureStore from "expo-secure-store";
import { AxiosContext } from "../../context/AxiosContext";
import socket from "../../utils/socket";
import { Feather } from "@expo/vector-icons";
import Ribbon from "../../components/Ribbon";
import { AuthContext } from "../../context/AuthContext";
import NotiDialog from "../../components/NotiDialog";

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

const Inventory = ({ navigation }: any) => {
  const { publicAxios } = useContext(AxiosContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [reportList, setReportList] = useState(null);
  const [isReported, setIsReported] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const [voucherSells, setVoucherSells] = useState<VoucherSell[]>([]);
  const [voucherSellGroup, setVoucherSellGroup] = useState<any>([]);
  const isFocused = useIsFocused();
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending");

  const { authAxios } = useContext(AxiosContext);

  const { authState } = useContext(AuthContext);

  const fetchVouchers = async () => {
    setLoading(true);
    //filter&search logic
    let query: string = "";
    let storedUser = await SecureStore.getItem("user");
    let userId = storedUser ? JSON.parse(storedUser)._id : "";
    const url = `/voucherSell/search?userId=${userId}&${query}&status=${status}`;

    publicAxios
      .get(url)
      .then((res) => {
        console.log(`------------${url}`);
        res.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
        setVoucherSells(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsEmpty(true);
        console.log("error", err.message);
        setLoading(false);
      });
  };

  const fetchReportList = async () => {
    const response = await authAxios.get("/reports");
    console.log("report: ", response.data.data);

    setReportList(response.data.data);
  };

  const checkIsReported = (item: any) => {
    const check = reportList.find(
      (report) =>
        report.user._id === authState.user._id && report.voucher === item
    );

    console.log(check);

    if (check) return true;

    return false;
  };

  //filter
  const initFilter: string[] = [
    "All",
    "Food",
    "Drink",
    "Entertainment",
    "Shopping",
    "Travel",
    "Education",
    "Health",
    "Beauty",
    "Service",
  ];
  const [category, setCategory] = useState<string>(initFilter[0]);

  useEffect(() => {
    fetchVouchers();
    fetchReportList();
  }, [isFocused, category, status]);

  useEffect(() => {
    // Group transactions by voucherId._id and calculate quantity
    const groupTransactions = () => {
      const grouped: { [key: string]: any } = {};

      voucherSells.forEach((transaction) => {
        const voucherId = transaction.voucherId._id;

        if (grouped[voucherId]?.quantity >= 1) {
          grouped[voucherId].quantity += 1;
          grouped[voucherId].transactions.push(transaction);
        } else {
          grouped[voucherId] = {
            quantity: 1,
            transactions: [transaction],
          };
        }
      });

      const groupedArray = Object.keys(grouped).map((key) => ({
        voucherId: key,
        quantity: grouped[key].quantity,
        transactions: grouped[key].transactions,
      }));

      setVoucherSellGroup(groupedArray);
    };

    groupTransactions();
  }, [voucherSells]);

  //search name
  const [searchName, setSearchName] = useState<string>("");

  //modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  //scroll hide header
  const [isShowHeader, setIsShowHeader] = React.useState(true);

  //Handle use QR
  const handleUseQR = async (voucherSell: VoucherSell) => {
    try {
      const voucherSellResult = await publicAxios.post(
        "/voucherSell/generateQRCode",
        {
          voucherId: voucherSell.transactions[0]._id,
        }
      );
      console.log("----handleUseQR", voucherSellResult.data.voucher.hash);
      socket.emit("generateQRCode", {
        hash: voucherSellResult.data.voucher.hash,
      });
      navigation.navigate("QR", {
        voucherSell: voucherSellResult.data.voucher,
      });
    } catch (error) {
      console.log("----handleUseQR", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        flexDirection={"row"}
        justifyContent={"space-between"}
        display={isShowHeader ? "" : "none"}
        style={styles.header}
      >
        <Text style={styles.title}>My Vouchers</Text>
        <View width={"1/3"}>
          <Select
            selectedValue={status}
            backgroundColor={"white"}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Select.Item label="Available" value="pending" />
            <Select.Item label="Used" value="used" />
          </Select>
        </View>
      </View>

      {isEmpty ? (
        <Center height={"700"} backgroundColor={"#004165"}>
          <Image
            size={"lg"}
            source={require("../../../assets/box.png")}
            alt="placeholder"
          />
          <Text color={"white"} style={{ marginBottom: 20, marginTop: 10 }}>
            {" "}
            You haven't bought any voucher yet
          </Text>
          <Button
            onPress={() => navigation.navigate("Voucher")}
            backgroundColor={"amber.500"}
            borderRadius={80}
          >
            Go to voucher shop
          </Button>
        </Center>
      ) : null}
      <FlatList
        data={voucherSellGroup}
        keyExtractor={(item: any) => "_" + item.voucherId.toString()}
        // onScroll={() => setIsShowHeader(false)}
        // onStartReached={() => setIsShowHeader(true)}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={[styles.item]}
            key={item.voucherId}
            onPress={() => {
              navigation.navigate("InventoryVoucherDetail", {
                voucherSell: item?.transactions[0],
              });
            }}
          >
            {status === "pending" &&
              item?.transactions[0]?.voucherId.endUseTime &&
              new Date(item?.transactions[0]?.voucherId.endUseTime) -
                new Date() <
                24 * 60 * 60 * 1000 && (
                <Ribbon text="Almost expired" color={"orange"} height={36} />
              )}

            {status === "pending" &&
              item?.transactions[0]?.voucherId.endUseTime &&
              new Date(item?.transactions[0]?.voucherId.endUseTime) <
                new Date() && (
                <Ribbon text="Expired" color={"red"} height={36} />
              )}
            <View style={styles.item}>
              <View style={styles.voucherHeader}>
                <Image
                  source={{
                    uri: item?.transactions[0]?.voucherId?.imageUrl,
                  }}
                  alt={"(voucher-image)"}
                  height={90}
                  width={"30%"}
                />
                <View
                  flexDirection={"column"}
                  marginLeft={5}
                  marginRight={5}
                  width={240}
                >
                  <Text numberOfLines={1} fontSize={20} fontWeight={"bold"}>
                    {item.transactions[0].voucherId.name}
                  </Text>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <Ionicons
                      style={{ paddingRight: 10 }}
                      name="ticket-outline"
                      color="green"
                      size={24}
                    />
                    <Text fontSize={30} color={"green.800"}>
                      {item.transactions[0].voucherId.discount}
                    </Text>
                    <Text fontSize={30} color={"green.800"}>
                      {item.transactions[0].voucherId.discountType ===
                      "percentage"
                        ? "% OFF"
                        : "K OFF"}
                    </Text>
                  </View>
                </View>
              </View>

              <View flexDirection={"row"}>
                <View
                  width={50}
                  height={50}
                  position={"absolute"}
                  left={-58}
                  top={-8}
                  borderRadius={50}
                  backgroundColor={"#004165"}
                />
                <View
                  height={0}
                  width={"98%"}
                  borderWidth={2}
                  borderColor={"gray.500"}
                  borderStyle={"dashed"}
                  margin={2}
                  marginTop={5}
                />
                <View
                  width={50}
                  height={50}
                  position={"absolute"}
                  right={-58}
                  top={-8}
                  borderRadius={50}
                  backgroundColor={"#004165"}
                />
              </View>
              <View
                flexDirection={"row"}
                justifyContent={"space-between"}
                mt={3}
              >
                <View style={{ gap: 10 }}>
                  <View flexDirection={"row"}>
                    <Ionicons name="calendar-outline" size={20} color="green" />
                    <Text color={"gray.500"} paddingLeft={2}>
                      {`${new Date(
                        item.transactions[0].voucherId.startUseTime
                      ).toLocaleDateString()} - ${new Date(
                        item.transactions[0].voucherId.endUseTime
                      ).toLocaleDateString()}`}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 19, fontWeight: "500" }}>
                    Quantity: {item.quantity}
                  </Text>
                </View>

                <View style={{ gap: 10 }}>
                  {status === "pending" ? (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 8,
                        width: 80,
                        backgroundColor: "tomato",
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        handleUseQR(item);
                        // navigation.navigate("QR", { voucherSell: item });
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Use now
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      paddingVertical: 8,
                      width: 80,
                      backgroundColor: "red",
                      borderRadius: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      const isCheck = checkIsReported(
                        item?.transactions[0]?.voucherId._id
                      );

                      if (isCheck) {
                        setIsOpenDialog(true);
                      } else {
                        navigation.navigate("UserReport", {
                          voucherId: item.voucherId,
                          voucherSellId: item.transactions[0]._id,
                        });
                      }
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>

      {isOpenDialog && (
        <NotiDialog
          navigation={navigation}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          title={"Alert"}
          message={"You already reported this voucher"}
        />
      )}
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004165",
    paddingBottom: 10,
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    marginBottom: 0,
  },
  voucherHeader: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  isPress: {
    transform: [{ scale: 0.9 }],
    opacity: 0.5,
  },
});
