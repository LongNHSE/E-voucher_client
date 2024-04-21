import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  Icon,
  SearchIcon,
  Center,
  Input,
  Modal,
  FormControl,
  Button,
  HStack,
  Select,
  Divider,
  CheckIcon,
} from "native-base";
import {
  Pressable,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { TextInput } from "react-native-paper";
import { baseUrl } from "../../utils/appConstant";
import voucherPlaceholder from "../../../assets/icon.png";
import { Ionicons } from "@expo/vector-icons";
import { green100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import * as SecureStore from "expo-secure-store";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [voucherSells, setVoucherSells] = useState<VoucherSell[]>([]);
  const isFocused = useIsFocused();

  const fetchVouchers = async () => {
    setLoading(true);
    //filter&search logic
    let query: string = "";
    let storedUser = await SecureStore.getItem("user");
    let userId = storedUser ? JSON.parse(storedUser)._id : "";
    const url = `${baseUrl}/voucherSell/search?userId=${userId}&${query}`;

    axios
      .get(url)
      .then((res) => {
        console.log(`------------${url}`);
        setVoucherSells(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
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

  //search name
  const [searchName, setSearchName] = useState<string>("");

  //modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  //scroll hide header
  const [isShowHeader, setIsShowHeader] = React.useState(true);

  return (
    <View style={styles.container}>
      <View display={isShowHeader ? "" : "none"} style={styles.header}>
        <Text style={styles.title}>My Vouchers</Text>
      </View>

      <FlatList
        backgroundColor={"#004165"}
        data={voucherSells}
        keyExtractor={(item: VoucherSell) => "_" + item._id.toString()}
        // onScroll={() => setIsShowHeader(false)}
        // onStartReached={() => setIsShowHeader(true)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item]}
            key={item._id}
            onPress={() => {
              navigation.navigate("InventoryVoucherDetail", {
                voucherSell: item,
              });
            }}
          >
            <View style={styles.item}>
              <View style={styles.voucherHeader}>
                <Image
                  source={{
                    uri: item.voucherId.imageUrl,
                  }}
                  alt={"(voucher-image)"}
                  height={90}
                  width={"30%"}
                />
                <View flexDirection={"column"} marginLeft={5} marginRight={5}>
                  <Text fontSize={20} fontWeight={"bold"}>
                    {item.voucherId.name}
                  </Text>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <Ionicons
                      style={{ paddingRight: 10 }}
                      name="ticket-outline"
                      color="green"
                      size={24}
                    />
                    <Text fontSize={30} color={"green.800"}>
                      {item.voucherId.discount}
                    </Text>
                    <Text fontSize={30} color={"green.800"}>
                      {item.voucherId.discountType === "percentage"
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
                  top={-12}
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
                />
                <View
                  width={50}
                  height={50}
                  position={"absolute"}
                  right={-58}
                  top={-12}
                  borderRadius={50}
                  backgroundColor={"#004165"}
                />
              </View>
              <View flexDirection={"row"} justifyContent={"space-between"}>
                <View flexDirection={"row"}>
                  <Ionicons name="calendar-outline" size={20} color="green" />
                  <Text color={"gray.500"} paddingLeft={2}>
                    {`${new Date(
                      item.voucherId.startUseTime
                    ).toLocaleDateString()} - ${new Date(
                      item.voucherId.endSellTime
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
                    navigation.navigate("QR", { voucherSell: item });
                  }}
                >
                  <Text color={"white"}>Use now</Text>
                </TouchableOpacity>
              </View>
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
