import { View, Text } from "react-native";
import React from "react";
import Voucher from "./Voucher";
import { AntDesign } from "@expo/vector-icons";
import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import GiftVoucher from "./GiftVoucher";
import VoucherDetail from "./VoucherDetail";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const userTabValue: TabBarProps[] = [
  {
    route: "Voucher",
    component: Voucher,
    tabBarLabel: "Voucher",
    tabBarIconProps: {
      iconType: AntDesign,
      iconName: "gift",
    },
  },
  {
    route: "GiftVoucher",
    component: GiftVoucher,
    tabBarLabel: "GiftVoucher",
    tabBarIconProps: {
      iconType: AntDesign,
      iconName: "gift",
    },
  },
];

const UserTab = () => {
  return CustomBottomTab(userTabValue);
};

export default UserTab;
