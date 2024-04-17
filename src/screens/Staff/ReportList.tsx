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
  Select,
} from "native-base";
import React, { useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const reportList = [
  {
    id: 1,
    voucherName: "Voucher name",
    percentDiscount: "20%",
    voucherCode: "123456789",
    createDate: "2022-01-01",
    image: require("../../../assets/icon.png"),
    userName: "UserName",
    numberOfReport: 12,
    role: "Role",
    status: "pending",
    reportReason:
      "Voucher is not working when purchasing through the app at the store",
  },
  {
    id: 2,
    voucherName: "Voucher name",
    percentDiscount: "20%",
    voucherCode: "123456789",
    createDate: "2022-01-01",
    image: require("../../../assets/icon.png"),
    userName: "UserName",
    numberOfReport: 12,
    role: "Role",
    status: "pending",
    reportReason:
      "Voucher is not working when purchasing through the app at the store",
  },
  {
    id: 3,
    voucherName: "Voucher name",
    percentDiscount: "20%",
    voucherCode: "123456789",
    createDate: "2022-01-01",
    image: require("../../../assets/icon.png"),
    userName: "UserName",
    numberOfReport: 12,
    role: "Role",
    status: "answered",
    reportReason:
      "Voucher is not working when purchasing through the app at the store",
  },
];

const ReportList = ({ navigation }: any) => {
  const [filterReport, setFilterReport] = useState("all");
  return (
    <ScrollView className="my-4 mx-4">
      <Heading fontSize="2xl">Recent report</Heading>
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
        onValueChange={(e) => setFilterReport(e)}
      >
        <Select.Item label="All" value="all" />
        <Select.Item label="Pending" value="pending" />
        <Select.Item label="Answered" value="answered" />
      </Select>
      {reportList
        .filter((report) => {
          return filterReport === "all" || report.status === filterReport;
        })
        .map((report) => (
          <Pressable
            key={report.id}
            onPress={() =>
              navigation.navigate("ReportDetail", { report: report })
            }
          >
            {({ isPressed }) => {
              return (
                <View
                  style={{
                    transform: [{ scale: isPressed ? 0.95 : 1 }],
                  }}
                  className="flex-row justify-between items-center bg-gray-200 p-4 rounded-3xl mt-4"
                >
                  <View className="flex-row justify-around items-center">
                    <Icon as={MaterialIcons} name="discount" size={5} />
                    <Text className="text-lg font-bold">
                      {report.voucherName}
                    </Text>
                  </View>
                  <View className="flex-column justify-center">
                    <Text className="text-lg">
                      {report.numberOfReport} reports
                    </Text>
                    <Text className="text-lg capitalize">{report.status}</Text>
                  </View>
                </View>
              );
            }}
          </Pressable>
        ))}
    </ScrollView>
  );
};

export default ReportList;
