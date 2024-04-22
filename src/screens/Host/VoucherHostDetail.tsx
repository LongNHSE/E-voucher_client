import { View, Text, Image, Button, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, ImageBackground } from "react-native";
import { Chip } from "react-native-paper";

import axios from "axios"; // Import axios library
import { baseUrl } from "../../utils/appConstant";
import { SimpleLineIcons } from "@expo/vector-icons";
const url = `${baseUrl}/vouchers`;

const VoucherHostDetail = ({ route }: any) => {
  const { voucher } = route.params;
  const [updatedVoucher, setUpdatedVoucher] = useState(voucher);
  const [showToast, setShowToast] = useState(false);
  const updateVoucherStatus = async () => {
    try {
      const response = await axios.patch(`${url}/${voucher._id}/status`, {
        status: "unavailable",
      });
      setUpdatedVoucher(response.data.data);
      console.log(':::::::::::::::::::::',response.data.data);
      
      setShowToast(true);
    } catch (error) {
      console.error("Error updating voucher status:", error);
    }
  };

  useEffect(() => {
    if (showToast) {
      Alert.alert("Update Successful", "Voucher status updated successfully");
      setShowToast(false);
    }
  }, [showToast]);
 
  const formatNumber = (number) => {
    if (number !== undefined && number !== null) {
      const parts = number.toFixed(0).toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return parts.join(".");
    }
    return "N/A";
  };

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
  const { icon, backgroundColor } = getColorForStatus(updatedVoucher.status);
  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    const formattedDay = `${day < 10 ? "0" : ""}${day}`;
    const formattedMonth = `${month < 10 ? "0" : ""}${month}`;
    const formattedHours = `${hours < 10 ? "0" : ""}${hours}`;
    const formattedMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;

    return `${formattedHours}:${formattedMinutes} ${formattedDay}/${formattedMonth}/${year}`;
  };

  return (
    <ScrollView>
      <ImageBackground
        source={require("../../../assets/graybackground.png")}
        resizeMode="cover"
      >
        <Image
          source={{ uri: voucher?.imageUrl }}
          alt="voucher"
          size={40}
          rounded="full"
          alignSelf={"center"}
          position={"relative"}
          top={20}
          zIndex={1}
        />

        <View
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="white"
          rounded="xl"
          paddingTop={90}
          paddingBottom={10}
        >
          <Text className="text-3xl font-bold">{voucher.name}</Text>
          <View className="align-middle flex-row">
            <Text marginRight={2}>
              <SimpleLineIcons name="tag" size={17} color="black" />
            </Text>
            <Text className="text-md font-semibold">
              {voucher.discount}{" "}
              {voucher.discountType === "percentage" ? "% OFF" : "VND"}
            </Text>
          </View>
          <View width={"80%"} alignItems={"center"} marginBottom={30}>
            <Text className="text-xl">{voucher.description}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Status: </Text>
            <Chip
              className="capitalize"
              icon={icon}
              style={{ backgroundColor: backgroundColor, width: 120 }}
            >
              <Text className="capitalize" style={{ color: "black" }}>
                {updatedVoucher.status}
              </Text>
            </Chip>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Code: </Text>
            <Text className="text-xl">{voucher.code}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Category: </Text>
            <Text className="text-xl">{voucher.category}</Text>
          </View>

          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Price: </Text>
            <Text className="text-xl">{formatNumber(voucher.price)} VND</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Quantity: </Text>
            <Text className="text-xl">{voucher.quantity} Vouchers</Text>
          </View>
          {/* <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">User name: </Text>
            <Text className="text-lg">{voucher.name}</Text>
          </View> */}
          <View
            width={"100%"}
            flexDirection="row"
            justifyContent="center"
            marginTop={1}
          >
            <Text className="text-lg">
              Use: {formatDate(voucher.startUseTime)} -{" "}
              {formatDate(voucher.endUseTime)}
            </Text>
          </View>

          <View width={"100%"} flexDirection="row" justifyContent="center">
            <Text className="text-lg">
              Sell: {formatDate(voucher.endSellTime)} -{" "}
              {formatDate(voucher.endSellTime)}
            </Text>
          </View>

          {/* {voucher.status === "pending" && (
            <View
              style={{
                marginTop: 20,
                width: "80%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant={"solid"}
                rounded="full"
                bg={"green.500"}
                _pressed={{
                  bg: "green.700",
                }}
              >
                Approve
              </Button>
              <Button
                variant={"solid"}
                rounded="full"
                bg={"red.500"}
                _pressed={{
                  bg: "red.700",
                }}
              >
                Reject
              </Button>
            </View>
          )} */}
          {updatedVoucher.status === "available" && (
            <Button
              marginTop={20}
              variant={"solid"}
              rounded="full"
              maxWidth={200}
              width="100%"
              bg={"red.500"}
              _pressed={{
                bg: "red.700",
              }}
              onPress={updateVoucherStatus}
            >
              Unavailable Voucher
            </Button>
          )}

          {updatedVoucher.status === "rejected" && (
            <View
              borderWidth={2}
              minWidth={200}
              minHeight={10}
              marginTop={5}
              borderRadius={30}
              borderColor={"#b3b3b3"}
              justifyContent={"center"}
              alignItems={"center"}
              padding={3}
            >
              <Text fontSize={16}>{updatedVoucher.rejectReason}</Text>
            </View>
          )}

          <View alignItems={"center"}>
            <Button width={170} borderRadius={25} marginTop={10}>
              Delete
            </Button>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default VoucherHostDetail;
