  import React, { useContext, useEffect, useState } from "react";
  import {
    View,
    Button,
    Pressable,
    Image,
    Text,
    Select,
    Input,
    Toast,
  } from "native-base";

import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { AxiosContext } from "../../context/AxiosContext";
import { baseUrl, getBaseURL } from "../../utils/appConstant";
import axios from "axios"; // Import axios library
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../../context/AuthContext";

export const VoucherCreation = () => {
  const { authAxios } = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const [voucher, setVoucher] = useState({
    id: 0,
    code: "",
    name: "Banana",
    discount: "0",
    description: "",
    price: "",
    quantity: "",
    startUseTime: new Date(),
    endUseTime: new Date(),
    startSellTime: new Date(),
    endSellTime: new Date(),
    status: "pending",
    imageURL: "",
    discountType: "percentage",
    category: "",
    host: authContext.authState.user._id,
  });
  const url = `${getBaseURL()}/vouchers`;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDateEndPicker, setShowDateEndPicker] = useState(false);
  const [showStartSellDatePicker, setShowStartSellDatePicker] = useState(false);
  const [showEndSellDatePicker, setShowEndSellDatePicker] = useState(false);
  const [startUseTime, setStartUseTime] = useState<Date>(null);
  const [endUseTime, setEndUseTime] = useState<Date>(null);
  const [startSellTime, setStartSellTime] = useState<Date>(null);
  const [endSellTime, setEndSellTime] = useState<Date>(null);
  const onChange = (event: Event, selectedDate: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" || event.type === "dismissed") {
      const currentDate = selectedDate || startUseTime;
      setStartUseTime(currentDate);
      setVoucher({ ...voucher, startUseTime: currentDate });
    }
  };
  const onChangeEnd = (event: Event, selectedDate: Date) => {
    setShowDateEndPicker(false);
    if (event.type === "set" || event.type === "dismissed") {
      const currentDate = selectedDate || endUseTime;
      // Check if the selected date is not earlier than startUseTime
      if (currentDate >= startUseTime) {
        setEndUseTime(currentDate);
        setVoucher({ ...voucher, endUseTime: currentDate });
      } else {
        // Notify the user about the invalid selection
        Toast.show({
          title: "Invalid Date Selection",
          status: "error",
          description: "End use time cannot be earlier than start use time.",
        });
      }
    }
  };

  const onChangeStartSellTime = (event: Event, selectedDate: Date) => {
    setShowStartSellDatePicker(false);
    if (event.type === "set" || event.type === "dismissed") {
      const currentDate = selectedDate || startSellTime;
      setStartSellTime(currentDate);
      setVoucher({ ...voucher, startSellTime: currentDate });
    }
  };

  const onChangeEndSellTime = (event: Event, selectedDate: Date) => {
    setShowEndSellDatePicker(false);
    if (event.type === "set" || event.type === "dismissed") {
      const currentDate = selectedDate || endSellTime;
      // Check if the selected date is not earlier than startSellTime
      if (currentDate >= startSellTime) {
        setEndSellTime(currentDate);
        setVoucher({ ...voucher, endSellTime: currentDate });
      } else {
        // Notify the user about the invalid selection
        Toast.show({
          title: "Invalid Date Selection",
          status: "error",
          description: "End sell time cannot be earlier than start sell time.",
        });
      }
    }
  };

    const handleInputChange = (field: any, value: any) => {
      if (field === "imageURL") {
        const imageUri = value.assets[0]?.uri || null;
        setVoucher({ ...voucher, [field]: imageUri });
      } else if (field === "discount" && voucher.discountType === "percentage") {
        const discountValue = parseFloat(value);
        if (discountValue >= 0 && discountValue <= 100) {
          setVoucher({ ...voucher, [field]: value });
        }
      } else if (field === "discount" && voucher.discountType === "VND") {
        const discountValue = parseInt(value);
        if (discountValue >= 0 && discountValue <= 1000000000) {
          setVoucher({ ...voucher, [field]: value });
        }
      } else if (field === "quantity") {
        const quantityValue = parseInt(value);
        if (quantityValue >= 0 && quantityValue <= 1000000) {
          setVoucher({ ...voucher, [field]: value });
        }
      } else {
        setVoucher({ ...voucher, [field]: value });
      }
    };
   
    interface ro {
      message: string;
      statusCode: number;
      dataString: string;
    }
    const uploadImage = async (uri: string) => {
      const result = await FileSystem.uploadAsync(
        "http://10.0.2.2:8000/vouchers/image",
        uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "image",
        }
      );
      const image = JSON.parse(result.body);

      return image;
    };

    const handleCreateVoucher = async () => {
      try {
        if (startSellTime >= startUseTime || endSellTime >= endUseTime) {
          Toast.show({
            title: "Invalid Date Selection",
            status: "error",
            description: "Sell time must be earlier than Use time.",
          });
          return;
        }
        const sellTimeDifference = Math.abs(
          endSellTime.getTime() - startSellTime.getTime()
        ) / (1000 * 60 * 60 *24);
    
        // Check if the sell time difference is greater than the timeLimits
        if (sellTimeDifference < timeLimits) {
          Toast.show({
            title: "Invalid Sell Time",
            status: "error",
            description: `Sell time must be higher than ${timeLimits} days.`,
          });
          return;
        }
        if (voucher.imageURL) {
          const uploadedImageUrl = await uploadImage(voucher.imageURL);
          const response = await authAxios.post(url, {
            ...voucher,
            imageUrl: uploadedImageUrl.data,
          });
          Toast.show({
            description: "Successfully added",
          });
        }

        
      } catch (error) {
        console.error("Error creating voucher:", error);
      }
    };

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        handleInputChange("imageURL", result);
      }
    };

    const formatNumber = (number: any) => {
      // Convert discount to a number before formatting
      const discountNumber = parseFloat(number);
      return discountNumber.toLocaleString("vi-VN"); // Format for Vietnamese locale
    };

    return (
      <View padding={3}>
        <Pressable key={voucher.id}>
          {({ isPressed }) => (
            <View
              style={{
                transform: [{ scale: isPressed ? 0.95 : 1 }],
              }}
              className="flex-row items-center bg-gray-200 rounded-md mt-4 "
            >
              <View
                className="border-r-2 border-gray-400 border-dashed mx-2"
                style={{ width: 90, height: 90 }}
              >
                {voucher.imageURL ? (
                  <Pressable onPress={pickImage}>
                    <Image
                      alt={voucher.name}
                      source={{ uri: voucher.imageURL }}
                      style={{ width: 90, height: 90, objectFit: "cover" }}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={pickImage}>
                    <View
                      style={{ width: 90, height: 90 }}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Feather name="image" size={24} color="black" />
                    </View>
                  </Pressable>
                )}
              </View>
              <View className="m-2 flex-column justify-center">
                <Text className="text-xl font-bold">{voucher.name}</Text>
                <Text className="text-md font-semibold">
                  Discount: {formatNumber(voucher.discount)}
                  {voucher.discountType === "percentage" ? "%" : "VND"}
                </Text>
                <Text className="text-md font-semibold">
                  Quantity: {voucher.quantity}
                </Text>
              </View>
              <View className="w-10 h-10 bg-gray-100 rounded-full absolute -right-5" />
            </View>
          )}
        </Pressable>
        <View flexDirection={"row"} justifyContent={"space-between"}>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text>Name:</Text>
            <TextInput
              style={[styles.input, { width: 100 }]}
              placeholder="Name"
              value={voucher.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text>Discount:</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={voucher.discount.toString()}
              onChangeText={(text) =>
                handleInputChange("discount", parseInt(text))
              }
            />
            <Select
              minWidth={90}
              variant="unstyled"
              selectedValue={voucher.discountType}
              onValueChange={(itemValue) =>
                handleInputChange("discountType", itemValue)
              }
            >
              <Select.Item label="%" value="percentage" />
              <Select.Item label="VND" value="VND" />
            </Select>
          </View>
        </View>
        <View flexDirection={"row"} justifyContent={"space-between"}>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text>Price:</Text>
            <TextInput
              style={[styles.input, { width: 100 }]}
              placeholder="Price"
              keyboardType="numeric"
              value={voucher.price.toString()}
              onChangeText={(text) => handleInputChange("price", parseInt(text))}
            />
            <Text>VND</Text>
          </View>
          <View flexDirection={"row"} alignItems={"center"}>
            <Text>Quantity:</Text>
            <TextInput
              style={[styles.input, { width: 70, marginRight: 40 }]}
              placeholder="Quantity"
              keyboardType="numeric"
              value={voucher.quantity.toString()}
              onChangeText={(text) =>
                handleInputChange("quantity", parseInt(text))
              }
            />
          </View>
        </View>
        <View flexDirection={"row"} alignItems={"center"}>
          <Text>Description:</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            multiline={true}
            placeholder="Description"
            value={voucher.description}
            onChangeText={(text) => handleInputChange("description", text)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "relative",
            alignItems: "center",
          }}
        >
          <Text>Start Use Time:</Text>
          <Text style={styles.input}>
            {startUseTime ? startUseTime.toLocaleDateString() : "Select Time"}
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ position: "absolute", left: 200, top: 13 }}
          >
            <AntDesign name="downcircleo" size={20} color="black" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startUseTime || new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChange}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "relative",
            alignItems: "center",
          }}
        >
          <Text marginRight={2}>End Use Time:</Text>
          <Text style={styles.input}>
            {endUseTime ? endUseTime.toLocaleDateString() : "Select Time"}
          </Text>
          <TouchableOpacity
            onPress={() => setShowDateEndPicker(true)}
            style={{ position: "absolute", left: 200, top: 12 }}
          >
            <AntDesign name="downcircleo" size={20} color="black" />
          </TouchableOpacity>
          {showDateEndPicker && (
            <DateTimePicker
              value={endUseTime || new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChangeEnd}
            />
          )}
        </View>
        <View></View>
        <View flexDirection={"row"} alignItems={"center"}>
          <View flexDirection={"row"} alignItems={"center"} marginRight={5}>
            <Text>Code:</Text>
            <TextInput
              style={[styles.input, { width: 60 }]}
              placeholder="Code"
              value={voucher.code}
              onChangeText={(text) => handleInputChange("code", text)}
            />
          </View>
          <Text>Category: </Text>
          <Select
            onValueChange={(itemValue) =>
              handleInputChange("category", itemValue)
            }
            width={180}
            height={9}
            placeholder="Category"
            marginY={2}
            rounded="full"
            fontSize={15}
          >
            <Select.Item label="Food" value="Food" />
            <Select.Item label="Drink " value="Drink" />
            <Select.Item label="Entertainment" value="Entertainment" />
            <Select.Item label="Shopping" value="Shopping" />
            <Select.Item label="Education" value="Education" />
            <Select.Item label="Health" value="Health" />
            <Select.Item label="Beauty" value="Beauty" />
            <Select.Item label="Service" value="Service" />
            <Select.Item label="Travel" value="Travel" />
          </Select>
        </View>

        <View
          style={{
            flexDirection: "row",
            position: "relative",
            alignItems: "center",
          }}
        >
          <Text>Start Sell Time:</Text>
          <Text style={styles.input}>
            {startSellTime ? startSellTime.toLocaleDateString() : "Select Time"}
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartSellDatePicker(true)}
            style={{ position: "absolute", left: 200, top: 13 }}
          >
            <AntDesign name="downcircleo" size={20} color="black" />
          </TouchableOpacity>
          {showStartSellDatePicker && (
            <DateTimePicker
              value={startSellTime || new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChangeStartSellTime}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            position: "relative",
            alignItems: "center",
          }}
        >
          <Text>End Sell Time:</Text>
          <Text style={styles.input}>
            {endSellTime ? endSellTime.toLocaleDateString() : "Select Time"}
          </Text>
          <TouchableOpacity
            onPress={() => setShowEndSellDatePicker(true)}
            style={{ position: "absolute", left: 200, top: 12 }}
          >
            <AntDesign name="downcircleo" size={20} color="black" />
          </TouchableOpacity>
          {showEndSellDatePicker && (
            <DateTimePicker
              value={endSellTime || new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChangeEndSellTime}
            />
          )}
        </View>
        <View justifyContent={'center'} alignItems={'center'}>
          <Text color={'amber.500'}>Sell time must higher than {timeLimits} days</Text>
        </View>
        <View alignItems={"center"}>
          <Button
            style={{ marginTop: 20, borderRadius: 20, width: 200 }}
            onPress={handleCreateVoucher}
          >
            Create Voucher
          </Button>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    input: {
      borderBottomWidth: 1,
      borderColor: "#adadad",
      marginVertical: 10,
      marginLeft: 10,
      marginBottom: 15,
      fontSize: 14,
    },
  });
