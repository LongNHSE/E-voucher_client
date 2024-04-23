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
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { AxiosContext } from "../../context/AxiosContext";
import { formatNumber } from "../../utils/NumberFormatter";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { publicAxios } = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const hostId = authContext.authState.user._id;

  const [totalVoucherSell, setTotalVoucherSell] = useState(0);
  const [totalVoucher, setTotalVoucher] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const url = `/vouchers/totalQuantity`;

  const fetchData = async () => {
    try {
      const response = await publicAxios.get(
        `/voucherSell/totalVoucherSell?hostId=${hostId}`
      );
      setTotalVoucherSell(response.data);

      const voucherResponse = await publicAxios.get(
        `/vouchers/totalQuantity?hostId=${hostId}`
      );
      setTotalVoucher(voucherResponse.data);

      const revenueResponse = await publicAxios.get(
        `/invoices/totalRevenue?hostId=${hostId}`
      );
      setTotalRevenue(revenueResponse.data.totalRevenue);
      console.log(
        "Total Revenue:::::::::::::::::::::::::",
        revenueResponse.data.totalRevenue
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once when component mounts

  // Use useFocusEffect to refetch data whenever the component gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  return (
    <ScrollView style={{ marginTop: 60, padding: 3 }}>
      <Heading fontSize="xl" textAlign="center">
        Dashboard Of {authContext.authState.user.firstName}{" "}
        {authContext.authState.user.lastName}
      </Heading>

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
          <Text fontSize="2xl" mt={2} fontWeight={"bold"}>
            {formatNumber(totalRevenue)} VND
          </Text>
        </Box>
        <Box style={styles.box}>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <FontAwesome name="money" size={24} color="blue" />
            <Text marginLeft={2} fontSize="lg">
              Total Voucher Sell
            </Text>
          </View>
          <Text fontSize="2xl" mt={2} fontWeight="bold">
            {formatNumber(totalVoucherSell)} Vouchers
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
