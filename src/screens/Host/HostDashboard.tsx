import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Heading,
  Select,
  View,
  CheckIcon,
  Text,
  Box,
} from "native-base";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { AxiosContext } from "../../context/AxiosContext";
import { formatNumber } from "../../utils/NumberFormatter";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { publicAxios } = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const hostId = authContext.authState.user._id;
  const [totalVoucher, setTotalVoucher] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const url = `/vouchers/totalQuantity`;
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const voucherResponse = await publicAxios.get(`/vouchers/totalQuantity?hostId=${hostId}`);
        setTotalVoucher(voucherResponse.data);

        const revenueResponse = await publicAxios.get(`/invoices/totalRevenue?hostId=${hostId}`);
        setTotalRevenue(revenueResponse.data.totalRevenue);
        console.log("Total Revenue:::::::::::::::::::::::::", revenueResponse.data.totalRevenue);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  return (
    <ScrollView style={{ marginTop: 60, padding: 3 }}>
      <Heading fontSize="xl" textAlign="center">
        Dashboard
      </Heading>
      <View
        style={{ marginTop: 20 }}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text>
          <FontAwesome5 name="coins" size={18} color="black" /> 250.000 VND
        </Text>
        <Select
          width={200}
          borderRadius={30}
          placeholder="Select Month"
          fontSize={15}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
        >
          {months.map((month) => (
            <Select.Item key={month} label={month.toString()} value={month} />
          ))}
        </Select>
      </View>

      <View style={{ flexDirection: "column", marginTop: 20, padding: 10 }}>
        <Box style={styles.box}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <MaterialCommunityIcons
              name="ticket-percent-outline"
              size={24}
              color="blue"
            />
            <Text marginLeft={2} fontSize="lg">
              Total Voucher
            </Text>
          </View>

          <Text fontSize="2xl" mt={2} fontWeight={"bold"}>
            {formatNumber(totalVoucher)} Vouchers
          </Text>
        </Box>
        <Box style={styles.box}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Ionicons name="wallet-outline" size={24} color="blue" />
            <Text marginLeft={2} fontSize="lg">
              Total Revenue
            </Text>
            </View>
            <Text fontSize="2xl" mt={2} fontWeight={'bold'}>
              {formatNumber(totalRevenue)} VND
            </Text>
         
        </Box>
        <Box style={styles.box}>
          <Text fontSize="lg" fontWeight="bold">
            Total Voucher Sell
          </Text>
          <Text fontSize="2xl" mt={2}>
            200
          </Text>
        </Box>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 120,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
});
export default Dashboard;