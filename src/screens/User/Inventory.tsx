import { useIsFocused, useNavigation } from "@react-navigation/native";
import { View, Text, FlatList, Image, Center, Button } from "native-base";
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

  const [voucherSells, setVoucherSells] = useState<VoucherSell[]>([]);
  const [voucherSellGroup, setVoucherSellGroup] = useState<any>([]);
  const isFocused = useIsFocused();
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const fetchVouchers = async () => {
    setLoading(true);
    //filter&search logic
    let query: string = "";
    let storedUser = await SecureStore.getItem("user");
    let userId = storedUser ? JSON.parse(storedUser)._id : "";
    const url = `/voucherSell/search?userId=${userId}&${query}`;

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
  }, [isFocused, category]);

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
    console.log("handleUseQR", voucherSell);
    try {
      const voucherSellResult = await publicAxios.post(
        "/voucherSell/generateQRCode",
        {
          voucherId: voucherSell._id,
        }
      );
    } catch (error) {
      console.log("----handleUseQR", error);
    }
    console.log("voucherSellResult", voucherSellResult.data);
    navigation.navigate("QR", { voucherSell: voucherSellResult.data.voucher });
  };

  return (
    <View style={styles.container}>
      <View display={isShowHeader ? "" : "none"} style={styles.header}>
        <Text style={styles.title}>My Vouchers</Text>
      </View>

      {isEmpty ? (
        <Center height={"700"} backgroundColor={"#004165"}>
          <Image size={"lg"} source={require("../../../assets/box.png")} />
          <Text color={"white"}>- You haven't bought any voucher yet -</Text>
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
        backgroundColor={"#004165"}
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
                voucherSell: item.transactions[0],
              });
            }}
          >
            <View style={styles.item}>
              <View style={styles.voucherHeader}>
                <Image
                  source={{
                    uri: item.transactions[0].voucherId.imageUrl,
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
                  <Text fontSize={20} fontWeight={"bold"}>
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
                <View flexDirection={"row"}>
                  <Ionicons name="calendar-outline" size={20} color="green" />
                  <Text color={"gray.500"} paddingLeft={2}>
                    {`${new Date(
                      item.transactions[0].voucherId.startUseTime
                    ).toLocaleDateString()} - ${new Date(
                      item.transactions[0].voucherId.endSellTime
                    ).toLocaleDateString()}`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    padding: 5,
                    backgroundColor: "tomato",
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    handleUseQR(item);
                    // navigation.navigate("QR", { voucherSell: item });
                  }}
                >
                  <Text color={"white"}>Use now</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                Quantity: {item.quantity}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
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
