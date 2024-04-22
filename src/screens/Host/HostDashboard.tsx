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
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { AxiosContext } from "../../context/AxiosContext";
import { formatNumber } from "../../utils/NumberFormatter";
const Dashboard = () => {
  const { publicAxios } = useContext(AxiosContext);

  const [totalVoucher, setTotalVoucher] = useState(0);
  const url = `/vouchers/totalQuantity`;
  useEffect(() => {
    // Call axios to get the total voucher count
    publicAxios.get(url)
      .then((response) => {
        setTotalVoucher(response.data);
        console.log(totalVoucher);
        
      })
      .catch((error) => {
        console.error("Error fetching total voucher count:", error);
      });
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
          <Text fontSize="lg" fontWeight="bold">
            Total Voucher
          </Text>
          <Text fontSize="2xl" mt={2}>
          {formatNumber(totalVoucher)}
          </Text>
        </Box>
        <Box style={styles.box}>
          <Text fontSize="lg" fontWeight="bold">
            Total Quantity of Voucher
          </Text>
          <Text fontSize="2xl" mt={2}>
            500
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
    height:120,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
});
export default Dashboard;
