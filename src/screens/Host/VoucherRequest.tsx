import React, { useContext, useEffect, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { baseUrl } from "../../utils/appConstant";
import axios from "axios"; // Import axios library
import { SimpleLineIcons } from "@expo/vector-icons";
import { AxiosContext } from "../../context/AxiosContext";
const url = `/vouchers`;

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
  const navigation = useNavigation();
  const [vouchers, setVouchers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { publicAxios } = useContext(AxiosContext);

  const fetchVouchers = async () => {
    try {
      const response = await publicAxios.get(url);
      setVouchers(response.data);
      console.log("Vouchers:", response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  // Use the useFocusEffect hook to call fetchVouchers when the component gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchVouchers();
      // Cleanup function, if necessary
      return () => {
        // Cleanup code, if necessary
      };
    }, [])
  );
  return (
    <ScrollView style={styles.container}>
      <Heading style={styles.header} textAlign={"center"} fontSize="xl">
        Voucher List
      </Heading>
      <View
        style={{
          flexDirection:"row",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Button
          borderRadius={20}
          width={200}
          onPress={() => navigation.navigate("VoucherCreation")}
        >
          Create Voucher
        </Button>
      </View>
      <Input
        rounded="full"
        marginY={2}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
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
        <Select.Item label="Available" value="available" />
        <Select.Item label="Unavailable" value="unavailable" />
        <Select.Item label="Rejected" value="rejected" />
      </Select>
      {/* Voucher design sample */}
      {vouchers
        .filter(
          (voucher) =>
            (filterVoucher === "all" || voucher.status === filterVoucher) &&
            voucher.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((voucher) => {
          const { icon, backgroundColor } = getColorForStatus(voucher.status);
          return (
            <Pressable
              key={voucher._id}
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
                      source={{
                        uri: voucher?.imageUrl,
                      }}
                      alt="voucher"
                      size={20}
                      rounded="full"
                      marginRight={1}
                    />
                  </View>
                  <View className="m-2 flex-column justify-center align-middle">
                    <Text className="text-xl font-bold">{voucher.name}</Text>
                    <View className="align-middle flex-row">
                      <Text marginRight={2}>
                        <SimpleLineIcons name="tag" size={17} color="black" />
                      </Text>
                      <Text className="text-md font-semibold">
                        {voucher.discount}{" "}
                        {voucher.discountType === "percentage"
                          ? "% OFF"
                          : "VND"}
                      </Text>
                    </View>
                    <Chip
                      className="capitalize"
                      icon={icon}
                      style={{ backgroundColor: backgroundColor, width: 120 }}
                    >
                      <Text className="capitalize" style={{ color: "black" }}>
                        {voucher.status}
                      </Text>
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
  return <Voucher />;
};

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    margin: 4,
  },
});

export default VoucherRequest;
