import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Spinner,
  useToast,
} from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { AxiosContext } from "../../context/AxiosContext";
import { Animated, Dimensions } from "react-native";
import StickyHeader from "../../components/StickyHeader";

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
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [requestVoucher, setRequestVoucher] = useState<RequestVoucher[]>([]);
  const [filterVoucher, setFilterVoucher] = useState<string>("pending");
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
        status: ["pending", "rejected", "available"],
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
    <View flex={1} bg={"#004165"}>
      <StickyHeader
        header="Voucher request list"
        filterList={["Pending", "Reject", "Available", "All"]}
        scrollOffsetY={scrollOffsetY}
        setFilterItem={setFilterVoucher}
      />
      <ScrollView
        onScroll={() => {
          Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            {
              useNativeDriver: false,
            }
          );
        }}
      >
        <View className="mt-4 mx-4">
          {/* Voucher design sample */}
          {requestVoucher
            .filter((voucher) => {
              return (
                filterVoucher === "all" || voucher.status === filterVoucher
              );
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
                      bg={"white"}
                      className="flex-row items-center rounded-md mt-4"
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
                        <Text className="text-xl font-bold">
                          {voucher.name}
                        </Text>
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
                      <View
                        bg={"#004165"}
                        className="w-10 h-10 rounded-full absolute -right-5"
                      />
                    </View>
                  );
                }}
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default StaffDashboard;
