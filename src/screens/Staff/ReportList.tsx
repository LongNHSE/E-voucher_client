import {
  View,
  Text,
  ScrollView,
  Heading,
  Icon,
  Box,
  Pressable,
  Input,
  Select,
  useToast,
} from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import StickyHeader from "../../components/StickyHeader";
import { Animated, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AxiosContext } from "../../context/AxiosContext";
import { AuthContext } from "../../context/AuthContext";

// const reportList = [
//   {
//     id: 1,
//     voucherName: "Voucher name",
//     percentDiscount: "20%",
//     voucherCode: "123456789",
//     createDate: "2022-01-01",
//     image: require("../../../assets/icon.png"),
//     userName: "UserName",
//     numberOfReport: 12,
//     role: "Role",
//     status: "pending",
//     reportReason:
//       "Voucher is not working when purchasing through the app at the store",
//   },
//   {
//     id: 2,
//     voucherName: "Voucher name",
//     percentDiscount: "20%",
//     voucherCode: "123456789",
//     createDate: "2022-01-01",
//     image: require("../../../assets/icon.png"),
//     userName: "UserName",
//     numberOfReport: 12,
//     role: "Role",
//     status: "pending",
//     reportReason:
//       "Voucher is not working when purchasing through the app at the store",
//   },
//   {
//     id: 3,
//     voucherName: "Voucher name",
//     percentDiscount: "20%",
//     voucherCode: "123456789",
//     createDate: "2022-01-01",
//     image: require("../../../assets/icon.png"),
//     userName: "UserName",
//     numberOfReport: 12,
//     role: "Role",
//     status: "answered",
//     reportReason:
//       "Voucher is not working when purchasing through the app at the store",
//   },
// ];

const { width, height }: { width: any; height: any } = Dimensions.get("window");

interface Report {
  _id: string;
  voucherSell: {
    _id: string;
    status: string;
    userId: string;
    voucherId: {
      _id: string;
      name: string;
      code: string;
      quantity: number;
      startUseTime: string;
      endUseTime: string;
      discount: number;
      discountType: string;
      price: number;
      status: string;
      startSellTime: string;
      endSellTime: string;
      description: string;
      imageUrl: string;
      condition: string[];
      host: string;
      staff: null | string;
      rejectReason: null | string;
      category: string;
      updatedAt: string;
      id: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  };
  reportType: {
    _id: string;
    name: string;
    id: string;
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    status: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    refreshToken: string;
    id: string;
  };
  staff: null | string;
  userMessage: string;
  staffMessage: null | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

const ReportList = ({ navigation }: any) => {
  const focus = useIsFocused();
  const toast = useToast();
  const { authAxios } = useContext(AxiosContext);
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [reportTypes, setReportTypes] = useState<string[]>([]);
  const [filterReport, setFilterReport] = useState<string>("");
  const [reportList, setReportList] = useState<Report[]>([]);

  useEffect(() => {
    if (focus) {
      fetchReportType();
      fetchReport();
    }
  }, [focus]);

  const fetchReport = async () => {
    try {
      const response = await authAxios.get("/reports/staff");
      if (response.data.message === "Success") {
        setReportList(response.data.data);
      } else {
        toast.show({
          title: "Error",
          description: "Failed to fetch report",
        });
      }
    } catch (error: any) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
      console.log("error", error.message);
    }
  };

  const fetchReportType = async () => {
    try {
      const response = await authAxios.get("/reportTypes");
      if (response.data.message === "Success") {
        const reportType = response.data.data.map((reportType: any) => {
          return reportType.name;
        });
        setReportTypes(reportType);
      } else {
        toast.show({
          title: "Error",
          description: "Failed to fetch report type",
        });
      }
    } catch (error: any) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
      console.log("error", error.message);
    }
  };
  return (
    <View>
      <StickyHeader
        header="Voucher report list"
        // searchBar={false}
        filterList={reportTypes}
        setFilterItem={setFilterReport}
        scrollOffsetY={scrollOffsetY}
      />
      <ScrollView bg={"#004165"} height={height - 200}>
        <View className="my-4 mx-4">
          {reportList
            .filter((report) => {
              return (
                filterReport.toLowerCase() === "" ||
                report.reportType.name.toLocaleLowerCase() ===
                  filterReport.toLocaleLowerCase()
              );
            })
            .map((report) => (
              <Pressable
                key={report._id}
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
                        <Icon
                          as={MaterialIcons}
                          name="discount"
                          size={5}
                          marginRight={2}
                        />
                        <Text className="text-lg font-semibold w-32">
                          {report.voucherSell.voucherId.name}
                        </Text>
                      </View>
                      <View className="flex-column justify-center">
                        <Text className="text-md">
                          Username: {report.user.username}
                        </Text>
                        <Text className="text-md capitalize">
                          {report.reportType.name}
                        </Text>
                      </View>
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

export default ReportList;
