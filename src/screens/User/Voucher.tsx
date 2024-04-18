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
} from "native-base";
import { Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { TextInput } from "react-native-paper";
import { baseUrl } from "../../utils/appConstant";
import voucherPlaceholder from "../../../assets/icon.png";
import { Ionicons } from "@expo/vector-icons";

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
  const [filter, setFilter] = useState<string[]>([
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
  ]);

  useEffect(() => {
    fetchVouchers();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>E-Vouchers</Text>
        <Input
          marginTop={3}
          variant="filled"
          width="100%"
          borderRadius="10"
          py="1"
          px="2"
          placeholder="Search..."
          InputLeftElement={<Ionicons name="search" size={24} color="black" />}
        />
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {filter.map((item) => (
          <Pressable style={styles.filterItem} onPress={() => {}}>
            <Text fontSize={"md"}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <FlatList
        data={vouchers}
        keyExtractor={(item: Voucher) => "_" + item._id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              // navigation.navigate("VoucherDetail");
            }}
          >
            <View style={styles.item}>
              <Image
                source={{
                  uri: item.imageUrl,
                }}
                alt={"(voucher-image)"}
                width={100}
                height={100}
              />
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>{item.discount}</Text>
            </View>
          </Pressable>
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
  filterItem: {
    padding: 10,
    margin: 10,
    height: 40,
    borderRadius: 5,
    backgroundColor: "lightgray",
  },
  isPress: {
    transform: [{ scale: 0.95 }],
  },
});
