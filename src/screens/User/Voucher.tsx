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
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { TextInput } from "react-native-paper";
import { baseUrl } from "../../utils/appConstant";
import voucherPlaceholder from "../../../assets/icon.png";
import { Ionicons } from "@expo/vector-icons";
import { green100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import * as Linking from "expo-linking";
import { formatNumber } from "../../utils/NumberFormatter";
import { AxiosContext } from "../../context/AxiosContext";
import Ribbon from "../../components/Ribbon";

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
  createdAt: Date;
}

interface RO {
  statusCode: String;
  message: String;
  data: Voucher[];
}

const Voucher = ({ navigation }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const isFocused = useIsFocused();
  const { publicAxios } = useContext(AxiosContext);
  const fetchVouchers = () => {
    setLoading(true);
    //filter&search logic

    let query: string = "";
    if (category !== "All" && category !== "") {
      query = `&category=${category}`;
      console.log(">>>category", category);
    }
    if (searchName !== "") {
      query += `&name=${searchName}`;
    }

    const url = `/vouchers/search?status=available${query}`;

    publicAxios
      .get(url)
      .then((res) => {
        console.log(`------------${url}`);
        Array.isArray(res.data) &&
          res.data.forEach((item: Voucher) => {
            console.log(item.name);
          });

        setVouchers(res.data);
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

  //search name
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    fetchVouchers();
  }, [isFocused, category, searchName]);

  //modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  //scroll hide header
  const [isShowHeader, setIsShowHeader] = React.useState(true);

  return (
    <View style={styles.container}>
      <View display={isShowHeader ? "" : "none"} style={styles.header}>
        <Text style={styles.title}>E-Vouchers</Text>
        {/* <Image
          source={require("../../../assets/logo.png")}
          height={30}
          width={160}
          alt="logo"
        /> */}
        <View style={{ flexDirection: "row" }}>
          <Input
            marginTop={3}
            variant="filled"
            width="90%"
            borderRadius="10"
            py="1"
            px="2"
            placeholder="Search..."
            onChange={(value) => {
              setSearchName(value.nativeEvent.text);
            }}
            onEndEditing={() => {
              fetchVouchers();
            }}
            value={searchName}
            InputLeftElement={
              <Ionicons name="search" size={24} color="black" />
            }
            InputRightElement={
              <TouchableOpacity
                onPress={() => {
                  setSearchName("");
                  fetchVouchers();
                }}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            }
          />

          {/* modal */}
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Filter</Modal.Header>
              <Modal.Body>
                <Text>Select Service: </Text>
                <Select
                  selectedValue={category}
                  minWidth={200}
                  accessibilityLabel="Choose Service"
                  placeholder="Choose Service"
                  onValueChange={(itemValue) => {
                    setCategory(itemValue);
                  }}
                  _selectedItem={{
                    bg: "cyan.600",
                    endIcon: <CheckIcon size={4} />,
                  }}
                >
                  {initFilter.map((item, index) => (
                    <Select.Item label={item} value={item} key={index} />
                  ))}
                </Select>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setCategory(initFilter[0]);
                      setModalVisible(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    OK
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
          <HStack space={2} alignItems={"center"} justifyContent={"center"}>
            <Pressable
              onPress={() => {
                setModalVisible(true);
              }}
              style={({ pressed }) => [pressed ? styles.isPress : null]}
            >
              <Ionicons
                style={{ paddingTop: 10, paddingLeft: 10 }}
                name="filter-outline"
                size={28}
                color="black"
              />
            </Pressable>
          </HStack>
        </View>
        {/* end of modal */}
      </View>
      <FlatList
        backgroundColor={"#004165"}
        data={vouchers}
        keyExtractor={(item: Voucher) => "_" + item._id.toString()}
        // onScroll={() => setIsShowHeader(false)}
        // onStartReached={() => setIsShowHeader(true)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item]}
            key={item._id}
            onPress={() => {
              navigation.navigate("VoucherDetail", { item });
            }}
          >
            {item.createdAt &&
              new Date() - new Date(item.createdAt) < 24 * 60 * 60 * 1000 && (
                <Ribbon text="New" color={"red"} />
              )}

            <View style={styles.item}>
              <View style={styles.voucherHeader}>
                <Image
                  source={{
                    uri: item.imageUrl,
                  }}
                  alt={"(voucher-image)"}
                  height={90}
                  width={"30%"}
                />
                <View flexDirection={"column"} marginLeft={5} marginRight={5}>
                  <Text numberOfLines={1} fontSize={20} fontWeight={"bold"}>
                    {item.name}
                  </Text>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <Ionicons
                      style={{ paddingRight: 10 }}
                      name="ticket-outline"
                      color="green"
                      size={24}
                    />
                    <Text fontSize={30} color={"green.800"}>
                      {item.discount}
                    </Text>
                    <Text fontSize={30} color={"green.800"}>
                      {item.discountType === "percentage" ? "% OFF" : "K OFF"}
                    </Text>
                  </View>
                  <Text fontSize={12} color={"gray.500"}>
                    {item.quantity} vouchers left
                  </Text>
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
                      item.startUseTime
                    ).toLocaleDateString()} - ${new Date(
                      item.endSellTime
                    ).toLocaleDateString()}`}
                  </Text>
                </View>
                <View flexDirection={"row"}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="cash-outline"
                    size={20}
                    color="green"
                  />
                  <Text>{formatNumber(item.price)} VND</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
};

export default Voucher;

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
