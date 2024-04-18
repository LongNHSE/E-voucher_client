import { useIsFocused } from "@react-navigation/native";
import { View, Text, FlatList, ScrollView } from "native-base";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";
import { TextInput } from "react-native-paper";
import { baseUrl } from "../../utils/appConstant";

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

const Voucher = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const isFocused = useIsFocused();

  const fetchVouchers = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/vouchers`)
      .then((res) => {
        setVouchers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        console.log("error", err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVouchers();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search..." />
      <ScrollView></ScrollView>
      <FlatList
        data={vouchers}
        keyExtractor={(item: Voucher) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.discount}</Text>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

export default Voucher;

const styles = StyleSheet.create({
  container: {},
  item: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
