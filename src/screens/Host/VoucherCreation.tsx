import React, { useState } from "react";
import {
  View,
  Button,
  Pressable,
  Image,
  Text,
  Select,
  Input,
} from "native-base";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Feather } from '@expo/vector-icons';

export const VoucherCreation = () => {
  const [voucher, setVoucher] = useState({
    id: 0,
    name: "Banana",
    discount: "0",
    description: "",
    price: "",
    quantity: "",
    startUseTime: new Date(),
    endUseTime: new Date(),
    status: "pending",
    image: "",
    discountType: "%",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDateEndPicker, setShowDateEndPicker] = useState(false);
  const [startUseTime, setStartUseTime] = useState<Date>(null);
  const [endUseTime, setEndUseTime] = useState<Date>(null);
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
      setEndUseTime(currentDate);
      setVoucher({ ...voucher, endUseTime: currentDate });
    }
  };

  const handleInputChange = (field: any, value: any) => {
    if (field === "image") {
      const imageUri = value.assets[0]?.uri || null;
      console.log("adadawdaw112", value.assets[0].uri);

      setVoucher({ ...voucher, [field]: imageUri });
    } else if (field === "discount" && voucher.discountType === "%") {
      const discountValue = parseFloat(value);
      if (discountValue >= 0 && discountValue <= 100) {
        setVoucher({ ...voucher, [field]: value });
      }
    }
    else if (field === "discount" && voucher.discountType === "VND") {
      const discountValue = parseInt(value);
      if (discountValue >= 0 && discountValue <= 1000000000) {
        setVoucher({ ...voucher, [field]: value });
      }
    }
    else {
      setVoucher({ ...voucher, [field]: value });
    }
  };

  const handleCreateVoucher = () => {
    console.log("Created voucher:", voucher);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      handleInputChange("image", result);
      console.log(result);
    }
  };

  const formatNumber = (number: any) => {
    // Convert discount to a number before formatting
    const discountNumber = parseFloat(number);
    return discountNumber.toLocaleString("vi-VN"); // Format for Vietnamese locale
  };

  return (
    <View>
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
              style={{  width: 90, height: 90 }}
            >
              {voucher.image ? (
                <Pressable
                onPress={pickImage}
          >
                <Image
                  alt={voucher.name}
                  source={{ uri: voucher.image }}
                  style={{ width: 90, height: 90, objectFit: "cover" }}
                /></Pressable>
              ) : (  <Pressable onPress={pickImage}>
                <View style={{ width: 90, height: 90 }} justifyContent={'center'} alignItems={'center'}><Feather name="image" size={24} color="black" /></View></Pressable>
              )}
            </View>
            <View className="m-2 flex-column justify-center">
              <Text className="text-xl font-bold">{voucher.name}</Text>
              <Text className="text-md font-semibold">
               Discount: {formatNumber(voucher.discount)} {voucher.discountType}
              </Text>
              <Text className="text-md font-semibold">
               Quantity:  {voucher.quantity}
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
            <Select.Item label="%" value="%" />
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
            style={[styles.input, { width: 100 }]}
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
        <Text>Start Time:</Text>
        <Text style={styles.input}>
          {startUseTime ? startUseTime.toLocaleDateString() : "Select Time"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{ position: "absolute", left:166, top: 13 }}
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
        <Text marginRight={2}>End Time:</Text>
        <Text style={styles.input}>
          {endUseTime ? endUseTime.toLocaleDateString() : "Select Time"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDateEndPicker(true)}
          style={{ position: "absolute", left:166, top: 12 }}
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
      <Button style={{ marginTop: 20 }} onPress={handleCreateVoucher}>
        Create Voucher
      </Button>
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
    fontSize: 15,
  },
});
