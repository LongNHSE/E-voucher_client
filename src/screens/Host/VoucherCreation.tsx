import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Button,
  Pressable,
  Image,
  Text,
  Select,
  Toast,
  Box,
} from "native-base";

import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { AxiosContext } from "../../context/AxiosContext";
import { getBaseURL } from "../../utils/appConstant";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

export const VoucherCreation = () => {
  const { authAxios } = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();

    const formattedDay = `${day < 10 ? "0" : ""}${day}`;
    const formattedMonth = `${month < 10 ? "0" : ""}${month}`;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const [voucher, setVoucher] = useState({
    id: 0,
    code: "",
    name: "Voucher",
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
    condition: [""],
  });
  const url = `${getBaseURL()}/vouchers`;
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDateEndPicker, setShowDateEndPicker] = useState(false);
  const [showStartSellDatePicker, setShowStartSellDatePicker] = useState(false);
  const [showEndSellDatePicker, setShowEndSellDatePicker] = useState(false);
  const [startUseTime, setStartUseTime] = useState<Date>(null);
  const [endUseTime, setEndUseTime] = useState<Date>(null);
  const [startSellTime, setStartSellTime] = useState<Date>(null);
  const [endSellTime, setEndSellTime] = useState<Date>(null);
  const [formValid, setFormValid] = useState(false); // State variable to track form validity
  const [timeLimits, setTimeLimits] = useState(0); // State for time limits

  useEffect(() => {
    const fetchTimeLimits = async () => {
      try {
        const response = await authAxios.get(`${getBaseURL()}/timeLimits`);
        setTimeLimits(response.data.data[0].duration);
      } catch (error) {
        console.error("Error fetching time limits:", error);
      }
    };

    fetchTimeLimits(); // Call the function to fetch timeLimits when the component mounts
  }, []);
  useEffect(() => {
    // Check form validity whenever voucher state changes
    validateForm();
  }, [voucher]);

  const validateForm = () => {
    // Check if all required fields are filled
    const valid = Object.values(voucher).every((value) => value !== "");
    setFormValid(valid);
  };
  const [loading, setLoading] = useState(false);
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
  const handleAddCondition = () => {
    if (voucher.condition.length < 3) {
      setVoucher((prevState) => ({
        ...prevState,
        condition: [...prevState.condition, ""],
      }));
    } else {
      Toast.show({
        title: "Maximum Limit Reached",
        status: "error",
        description: "You can add up to three conditions.",
      });
    }
  };
  const handleRemoveCondition = (indexToRemove: number) => {
    const newConditions = voucher.condition.filter(
      (_, index) => index !== indexToRemove
    );
    setVoucher({ ...voucher, condition: newConditions });
  };
  const handleConditionInputChange = (value, index) => {
    // Update the condition array based on the input value and index
    const updatedConditions = [...voucher.condition];
    updatedConditions[index] = value;
    setVoucher((prevState) => ({
      ...prevState,
      condition: updatedConditions,
    }));
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

  const handleInputChange = (field: string, value: any, index?: number) => {
    if (field === "name") {
      // Check if the input name exceeds 15 words

      if (value.length > 15) {
        // Notify the user about the invalid name length
        Toast.show({
          title: "Invalid Name Length",
          status: "error",
          description: "Name must be 15 words or less.",
        });
        setVoucher({ ...voucher, [field]: "" });
        return;
      } else {
        setVoucher({ ...voucher, [field]: value });
      }
    } else if (field === "imageURL") {
      const imageUri = value.assets[0]?.uri || null;
      setVoucher({ ...voucher, [field]: imageUri });
    } else if (field === "discount" && voucher.discountType === "percentage") {
      const discountValue = parseFloat(value);
      if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
        setVoucher({ ...voucher, [field]: value });
      }
    } else if (field === "discount" && voucher.discountType === "VND") {
      const discountValue = parseInt(value);
      if (
        !isNaN(discountValue) &&
        discountValue >= 0 &&
        discountValue <= 1000000000
      ) {
        setVoucher({ ...voucher, [field]: value });
      }
    } else if (field === "quantity") {
      const numericValue = parseInt(value);
      if (!isNaN(numericValue) && numericValue > 0 && numericValue <= 100000) {
        setVoucher({ ...voucher, [field]: value });
      } else {
        Toast.show({
          description: "Quantity must below 100.000 vouchers.",
        });
        setVoucher({ ...voucher, [field]: "" });
      }
    } else if (field === "price") {
      const numericValue = parseInt(value);
      if (
        !isNaN(numericValue) &&
        numericValue > 0 &&
        numericValue <= 100000000
      ) {
        setVoucher({ ...voucher, [field]: value });
      } else {
        Toast.show({
          description: "Price must below 100.000.000 VND.",
        });
        setVoucher({ ...voucher, [field]: "" });
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
    const result = await FileSystem.uploadAsync(`${url}/image`, uri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "image",
    });
    const image = JSON.parse(result.body);
    return image;
  };

  const handleCreateVoucher = async () => {
    setLoading(true);
    try {
      if (formValid) {
        if (startSellTime > startUseTime || endSellTime > endUseTime) {
          Toast.show({
            title: "Invalid Date Selection",
            status: "error",
            description: "Sell time must be earlier than Use time.",
          });
          return;
        }

        const sellTimeDifference =
          Math.abs(endSellTime.getTime() - startSellTime.getTime()) /
          (1000 * 60 * 60 * 24);
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

          Alert.alert("Voucher Created", "Successfully added", [
            {
              text: "OK",
              onPress: () => {
                // Navigate back after user clicks OK
                navigation.goBack();
              },
            },
          ]);
        }
      } else {
        // Notify the user about missing fields
        Toast.show({
          title: "Incomplete Form",
          status: "error",
          description: "Please fill out all fields.",
        });
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
    } finally {
      setLoading(false);
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

  return (
    <ScrollView padding={3}>
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
                    padding={2}
                    rounded="full"
                    alt={voucher.name}
                    source={{ uri: voucher.imageURL }}
                    size={20}
                    style={{ width: 85, height: 85, objectFit: "cover" }}
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
                Discount: {formatNumber(voucher.discount)}{" "}
                {voucher.discountType === "percentage" ? "%" : "VND"}
              </Text>
              <Text className="text-md font-semibold">
                Quantity: {formatNumber(voucher.quantity)}
              </Text>
            </View>
            <View className="w-10 h-10 bg-gray-100 rounded-full absolute -right-5" />
            <View className="absolute right-10 top-18">
              <Text fontWeight={"bold"} style={{ color: "#808080" }}>
                {formatNumber(voucher.price.toString())} VND
              </Text>
            </View>
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
            value={formatNumber(voucher.discount.toString())}
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
            value={(voucher.price.toString())}
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
            value={(voucher.quantity.toString())}
            onChangeText={(text) =>
              handleInputChange("quantity", parseInt(text))
            }
          />
        </View>
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
          {startUseTime ? formatDate(startUseTime) : "Select Time"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{ position: "absolute", left: 190, top: 13 }}
        >
          <AntDesign name="downcircleo" size={20} color="black" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={startUseTime || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={new Date()}
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
          {endUseTime ? formatDate(endUseTime) : "Select Time"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDateEndPicker(true)}
          style={{ position: "absolute", left: 190, top: 12 }}
        >
          <AntDesign name="downcircleo" size={20} color="black" />
        </TouchableOpacity>
        {showDateEndPicker && (
          <DateTimePicker
            value={endUseTime || new Date()}
            mode="date"
            display="default"
            onChange={onChangeEnd}
            minimumDate={new Date()}
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
      <View justifyContent={"center"} alignItems={"center"}>
        <Text color={"amber.500"}>
          Sell time must higher than {timeLimits} days
        </Text>
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
          {startSellTime ? formatDate(startSellTime) : "Select Time"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowStartSellDatePicker(true)}
          style={{ position: "absolute", left: 190, top: 13 }}
        >
          <AntDesign name="downcircleo" size={20} color="black" />
        </TouchableOpacity>
        {showStartSellDatePicker && (
          <DateTimePicker
            value={startSellTime || new Date()}
            mode="date"
            display="default"
            onChange={onChangeStartSellTime}
            minimumDate={new Date()}
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
        <Text marginRight={2}>End Sell Time:</Text>
        <Text style={styles.input}>
          {endSellTime ? formatDate(endSellTime) : "Select Time"}
        </Text>
        <TouchableOpacity
          onPress={() => setShowEndSellDatePicker(true)}
          style={{ position: "absolute", left: 190, top: 12 }}
        >
          <AntDesign name="downcircleo" size={20} color="black" />
        </TouchableOpacity>
        {showEndSellDatePicker && (
          <DateTimePicker
            value={endSellTime || new Date()}
            mode="date"
            display="default"
            onChange={onChangeEndSellTime}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View flexDirection={"row"} alignItems={"center"}>
        <TextInput
          style={[styles.conditionInput, { flex: 1, marginBottom: 10 }]}
          multiline={true}
          placeholder="Description"
          value={voucher.description}
          onChangeText={(text) => handleInputChange("description", text)}
        />
      </View>

      <View justifyContent={"center"} alignItems={"center"}>
        {voucher.condition.map((condition, index) => (
          <View key={index} style={styles.conditionInputContainer}>
            <TextInput
              style={styles.conditionInput}
              placeholder={`Condition ${index + 1}`}
              value={condition}
              onChangeText={(text) => handleConditionInputChange(text, index)}
            />
            {index >= 0 && (
              <TouchableOpacity
                onPress={() => handleRemoveCondition(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>-</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={handleAddCondition} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Condition</Text>
        </TouchableOpacity>
      </View>

      <View alignItems={"center"}>
        <Button
          style={{
            marginTop: 20,
            borderRadius: 20,
            width: 200,
            marginBottom: 40,
          }}
          onPress={handleCreateVoucher}
        >
          Create Voucher
        </Button>
      </View>
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      )}
    </ScrollView>
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
  conditionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  conditionInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#adadad",
    borderRadius: 20,
    padding: 8,
  },
  addButton: {
    backgroundColor: "green",
    padding: 6,
    borderRadius: 5,
    width: 140,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  removeButton: {
    width: 30,
    backgroundColor: "green",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
