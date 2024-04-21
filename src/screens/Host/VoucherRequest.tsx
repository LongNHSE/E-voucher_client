import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  Heading,
  Icon,
  Image,
  Input,
  ScrollView,
  Select,
  Text,
  Pressable,
  Button,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
const requestVoucher = [
  {
    id: 1,
    name: "Starbucks",
    discount: "50% off",
    userName: "Dat",
    price: 100,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "rejected",
  },
  {
    id: 2,
    name: "KFC",
    discount: "30% off",
    userName: "Phi",
    price: 200,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "available",
  },
  {
    id: 3,
    name: "Pizza Hut",
    discount: "20% off",
    userName: "Long",
    price: 300,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "unavailable",
  },
  {
    id: 4,
    name: "Burger King",
    discount: "40% off",
    userName: "Nghia",
    price: 400,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "pending",
  },
  {
    id: 5,
    name: "Lotteria",
    discount: "10% off",
    userName: "Son",
    price: 500,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "rejected",
  },
  {
    id: 6,
    name: "McDonald",
    discount: "60% off",
    userName: "Tam",
    price: 600,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "available",
  },
  {
    id: 7,
    name: "Subway",
    discount: "70% off",
    userName: "Dang",
    price: 700,
    image: require("../../../assets/icon.png"),
    startUseTime: "2022-01-01",
    endUseTime: "2022-02-01",
    status: "pending",
  },
];
const getColorForStatus = (status: any) => {
  switch (status) {
    case "pending":
      return { icon: "playlist-edit", backgroundColor: "#ffff80" };
    case "available":
      return { icon: "check", backgroundColor: "#99ff99" };
    case "rejected":
      return { icon: "close", backgroundColor: "#ff8080" };
    case "unavailable":
      return { icon: "text-box-remove-outline", backgroundColor: "#c2d6d6" };
    default:
      return { textColor: "white", backgroundColor: "black" };
  }
};
const Voucher = () => {
  const [filterVoucher, setFilterVoucher] = useState("all");
  const navigation =useNavigation()

  return (
    <ScrollView style={styles.container}>
      <Heading fontSize="xl">Voucher list</Heading>
      <Button onPress={()=>navigation.navigate('VoucherCreation')}>Create Voucher</Button>
      <Input
        rounded="full"
        marginY={2}
        InputLeftElement={
          <Icon as={MaterialIcons} name="search" size={8} ml={2} />
        }
        _focus={{
          backgroundColor: "coolGray.300",
          borderColor: "coolGray.300",
        }}
      />
      <Select
        placeholder="Filter by status"
        marginY={2}
        rounded="full"
        onValueChange={(e) => setFilterVoucher(e)}
      >
        <Select.Item label="All" value="all" />
        <Select.Item label="Pending" value="pending" />
        <Select.Item label="Available" value="available" />{" "}
        <Select.Item label="Unavailable" value="unavailable" />
        <Select.Item label="Rejected" value="rejected" />
      </Select>
      {/* Voucher design sample */}
      {requestVoucher
        .filter(
          (voucher) =>
            filterVoucher === "all" || voucher.status === filterVoucher
        )
        .map((voucher) => {
          const { icon, backgroundColor } = getColorForStatus(
            voucher.status
          );
          return (
            <Pressable
              key={voucher.id}
              onPress={() =>
                navigation.navigate("VoucherHostDetail", { voucher })
              }
            >
              {({ isPressed }) => (
                <View
                  style={{
                    transform: [{ scale: isPressed ? 0.95 : 1 }],
                  }}
                  className="flex-row items-center bg-gray-200 rounded-md mt-4 "
                >
                  <View className="border-r-2 border-gray-400 border-dashed mx-2">
                    <Image
                      source={voucher.image}
                      alt="voucher"
                      size={20}
                      rounded="full"
                      marginRight={1}
                    />
                  </View>
                  <View className="m-2 flex-column justify-center">
                    <Text className="text-xl font-bold">{voucher.name}</Text>
                    <Text className="text-md font-semibold">
                      {voucher.discount}
                    </Text>

                    <Chip
                      className="capitalize"
                      icon={icon}
                      style={{ backgroundColor: backgroundColor }}
                    >
                     <Text className="capitalize" style={{color: 'black'}}>{voucher.status}</Text>
                    </Chip>
                  </View>
                  <View className="w-10 h-10 bg-gray-100 rounded-full absolute -right-5" />
                </View>
              )}
            </Pressable>
          );
        })}
    </ScrollView>
  );
};

const VoucherRequest = () => {
  return (
    <ScrollView>
      <View style={styles.header}>
        <AntDesign name="back" size={24} color="black" />
        <Text>Voucher</Text>
        <Text></Text>
      </View>
      <Voucher />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    margin: 4,
  },
});

export default VoucherRequest;
