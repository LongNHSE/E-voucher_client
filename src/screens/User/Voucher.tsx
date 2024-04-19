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

  const fetchVouchers = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/vouchers`)
      .then((res) => {
        console.table(res.data);
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
    "Food",
    "Drink",
    "Entertainment",
    "Shopping",
    "Travel",
    "Education",
    "Health",
    "Beauty",
    "Service",
    "Other",
  ];
  const [filter, setFilter] = useState<string[]>(initFilter);

  useEffect(() => {
    fetchVouchers();
  }, [isFocused]);

  //modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>E-Vouchers</Text>
        <View style={{ flexDirection: "row" }}>
          <Input
            marginTop={3}
            variant="filled"
            width="90%"
            borderRadius="10"
            py="1"
            px="2"
            placeholder="Search..."
            InputLeftElement={
              <Ionicons name="search" size={24} color="black" />
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
                <Select
                  selectedValue={filter[0]}
                  minWidth={200}
                  accessibilityLabel="Choose Service"
                  placeholder="Choose Service"
                  onValueChange={(itemValue) => {
                    setFilter([itemValue]);
                  }}
                  _selectedItem={{
                    bg: "cyan.600",
                    endIcon: <Ionicons name="checkmark" size={4} />,
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
                    Save
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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item]}
            key={item._id}
            onPress={() => {
              // navigation.navigate("VoucherDetail");
            }}
          >
            <View style={styles.item}>
              <View style={styles.voucherHeader}>
                <Image
                  source={{
                    uri: item.imageUrl,
                  }}
                  alt={"(voucher-image)"}
                  size={"lg"}
                />
                <View flexDirection={"column"} marginLeft={5} marginRight={5}>
                  <Text fontSize={20} fontWeight={"bold"}>
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
                    <Text fontSize={20} color={"green.800"}>
                      {item.discountType === "percent" ? "%" : "$"}
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
              <Text>{item.description}</Text>
              <Text>
                {`Availble in: ${new Date(
                  item.startUseTime
                ).toLocaleDateString()} - ${new Date(
                  item.endSellTime
                ).toLocaleDateString()}`}
              </Text>
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
