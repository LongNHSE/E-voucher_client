import { View, Text } from "react-native";
import React from "react";
import Voucher from "./Voucher";
import { AntDesign } from "@expo/vector-icons";
import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import GiftVoucher from "./GiftVoucher";
import VoucherDetail from "./VoucherDetail";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Setting from "../../components/Setting";
import { Ionicons } from "@expo/vector-icons";
import Inventory from "./Inventory";
import Profile from "./Profile";
import QRCode from "react-native-qrcode-svg";
import QR from "./QR";

const userTabValue: TabBarProps[] = [
  {
    route: "Voucher",
    component: Voucher,
    tabBarLabel: "Home",
    tabBarIconProps: {
      iconType: AntDesign,
      iconName: "home",
    },
  },
  {
    route: "Inventory",
    component: Inventory,
    tabBarLabel: "Inventory",
    tabBarIconProps: {
      iconType: AntDesign,
      iconName: "inbox",
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
