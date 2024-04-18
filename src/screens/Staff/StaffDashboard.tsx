import {
  View,
  Text,
  ScrollView,
  Heading,
  Icon,
  Box,
  Pressable,
  Input,
  AlertDialog,
  Button,
  Image,
  Divider,
  Select,
} from "native-base";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

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
    status: "approved",
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
    status: "pending",
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
    status: "approved",
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

const StaffDashboard = ({ navigation }: any) => {
  const [filterVoucher, setFilterVoucher] = useState("all");
  return (
    <ScrollView className="mt-4 mx-4">
      <Heading fontSize="2xl">Request voucher list</Heading>
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
        <Select.Item label="Approved" value="approved" />
        <Select.Item label="Rejected" value="rejected" />
      </Select>
      {/* Voucher design sample */}
      {requestVoucher
        .filter((voucher) => {
          return filterVoucher === "all" || voucher.status === filterVoucher;
        })
        .map((voucher) => (
          <Pressable
            key={voucher.id}
            onPress={() =>
              navigation.navigate("RequestVoucherDetail", { voucher: voucher })
            }
          >
            {({ isPressed }) => {
              return (
                <View
                  style={{
                    transform: [{ scale: isPressed ? 0.95 : 1 }],
                  }}
                  className="flex-row items-center bg-gray-200 rounded-md mt-4"
                >
                  <View className="border-r-2 border-gray-400 border-dashed mx-2">
                    <Image
                      source={require("../../../assets/icon.png")}
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
                    <Text
                      className="text-lg capitalize"
                      color={
                        voucher.status === "rejected"
                          ? "red.500"
                          : voucher.status === "approved"
                          ? "green.500"
                          : "gray.500"
                      }
                    >
                      {voucher.status}
                    </Text>
                  </View>
                  <View className="w-10 h-10 bg-gray-100 rounded-full absolute -right-5" />
                </View>
              );
            }}
          </Pressable>
        ))}
    </ScrollView>
  );
};

export default StaffDashboard;
