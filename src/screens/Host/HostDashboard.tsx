import React from "react";
import { ScrollView, Heading, Select, View, CheckIcon, Text, Box } from "native-base";
import { FontAwesome5 } from '@expo/vector-icons';
const Dashboard = () => {
  // Generate options for months from 1 to 12
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <ScrollView style={{ marginTop: 60 ,padding:3}}>
      <Heading fontSize="xl" textAlign="center">Dashboard</Heading>
      <View style={{ marginTop: 20 }} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
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
      <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
        <Box width="45%" bg="primary.100" borderRadius={10} p={4}>
          <Text fontSize="lg" fontWeight="bold">Total Voucher</Text>
          <Text fontSize="2xl" mt={2}>100</Text> {/* Example value, replace with actual data */}
        </Box>
        <Box width="45%" bg="primary.100" borderRadius={10} p={4}>
          <Text fontSize="lg" fontWeight="bold">Total Quantity of Voucher</Text>
          <Text fontSize="2xl" mt={2}>500</Text> {/* Example value, replace with actual data */}
        </Box>
      </View>
      <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
        <Box width="45%" bg="primary.100" borderRadius={10} p={4}>
          <Text fontSize="lg" fontWeight="bold">Total Voucher Sell</Text>
          <Text fontSize="2xl" mt={2}>200</Text> {/* Example value, replace with actual data */}
        </Box>
        <Box width="45%" bg="primary.100" borderRadius={10} p={4}>
          <Text fontSize="lg" fontWeight="bold">Fourth Box Content</Text>
          <Text fontSize="2xl" mt={2}>400</Text> {/* Example value, replace with actual data */}
        </Box>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
