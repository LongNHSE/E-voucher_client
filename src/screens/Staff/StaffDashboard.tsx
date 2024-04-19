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
  Spinner,
  useToast,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { AxiosContext } from "../../context/AxiosContext";
import { Dimensions } from "react-native";

// const requestVoucher = [
//   {
//     id: 1,
//     name: "Starbucks",
//     discount: "50% off",
//     userName: "Dat",
//     price: 100,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "rejected",
//   },
//   {
//     id: 2,
//     name: "KFC",
//     discount: "30% off",
//     userName: "Phi",
//     price: 200,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "approved",
//   },
//   {
//     id: 3,
//     name: "Pizza Hut",
//     discount: "20% off",
//     userName: "Long",
//     price: 300,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "pending",
//   },
//   {
//     id: 4,
//     name: "Burger King",
//     discount: "40% off",
//     userName: "Nghia",
//     price: 400,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "pending",
//   },
//   {
//     id: 5,
//     name: "Lotteria",
//     discount: "10% off",
//     userName: "Son",
//     price: 500,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "rejected",
//   },
//   {
//     id: 6,
//     name: "McDonald",
//     discount: "60% off",
//     userName: "Tam",
//     price: 600,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "approved",
//   },
//   {
//     id: 7,
//     name: "Subway",
//     discount: "70% off",
//     userName: "Dang",
//     price: 700,
//     image: require("../../../assets/icon.png"),
//     startUseTime: "2022-01-01",
//     endUseTime: "2022-02-01",
//     status: "pending",
//   },
// ];

interface RequestVoucher {
  id: number;
  name: string;
  discount: number;
  userName: string;
  price: number;
  imageUrl: any;
  startUseTime: string;
  endUseTime: string;
  status: string;
}

const { width, height }: { width: any; height: any } = Dimensions.get("window");

const StaffDashboard = ({ navigation }: any) => {
  const [requestVoucher, setRequestVoucher] = useState<RequestVoucher[]>([]);
  const [filterVoucher, setFilterVoucher] = useState<string>("all");
  const toast = useToast();
  const focus = useIsFocused();
  const { authAxios } = useContext<any>(AxiosContext);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  let isLoading = false;

  if (isLoading) return <Spinner />;

  const fetchVouchers = async () => {
    isLoading = true;
    try {
      const response = await authAxios.post("/vouchers/status", {
        status: ["pending", "reject", "available"],
      });
      if (response.data.message === "Success") {
        setRequestVoucher(response.data.data);
      } else {
        toast.show({
          title: "Error",
          description: "Failed to fetch voucher list",
        });
      }
    } catch (error: any) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
      console.log("error", error.message);
    }
    isLoading = false;
  };

  useEffect(() => {
    if (focus) fetchVouchers();
  }, [focus]);
  return (
    <View className="mt-4 mx-4">
      <Heading fontSize="2xl">Request voucher list</Heading>
      <View display="flex" flexDirection="row" justifyContent="space-between">
        <Input
          width={width / 1.8}
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
          width={width / 3}
          placeholder="Filter by status"
          marginY={2}
          rounded="full"
          onValueChange={(e) => setFilterVoucher(e)}
        >
          <Select.Item label="All" value="all" />
          <Select.Item label="Pending" value="pending" />
          <Select.Item label="Available" value="available" />
          <Select.Item label="Reject" value="reject" />
        </Select>
      </View>
      {/* Voucher design sample */}
      <ScrollView>
        {requestVoucher
          .filter((voucher) => {
            return filterVoucher === "all" || voucher.status === filterVoucher;
          })
          .map((voucher) => (
            <Pressable
              key={voucher.id}
              onPress={() =>
                navigation.navigate("RequestVoucherDetail", {
                  voucher: voucher,
                })
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
                        source={{ uri: voucher.imageUrl }}
                        alt="voucher"
                        size={20}
                        rounded="full"
                        marginRight={1}
                      />
                    </View>
                    <View className="m-2 flex-column justify-center">
                      <Text className="text-xl font-bold">{voucher.name}</Text>
                      <Text className="text-md font-semibold">
                        {voucher.discount} % off
                      </Text>
                      <Text
                        className="text-lg capitalize"
                        color={
                          voucher.status === "reject"
                            ? "red.500"
                            : voucher.status === "available"
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
    </View>
  );
};

export default StaffDashboard;
