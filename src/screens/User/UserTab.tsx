import { View, Text } from "react-native";
import React from "react";
import Voucher from "./Voucher";
import { AntDesign } from "@expo/vector-icons";
import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import GiftVoucher from "./GiftVoucher";
import Setting from "../../components/Setting";
import { Ionicons } from "@expo/vector-icons";

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
  {
    route: "Setting",
    component: Setting,
    tabBarLabel: "Setting",
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: "settings-outline",
    },
  },
];

const UserTab = () => {
  return CustomBottomTab(userTabValue);
};

export default UserTab;
