import { View, Text } from "react-native";
import React from "react";
import Voucher from "./Voucher";
import { AntDesign } from "@expo/vector-icons";
import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import Inventory from "./Inventory";
import Profile from "./Profile";

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
    route: "Profile",
    component: Profile,
    tabBarLabel: "Profile",
    tabBarIconProps: {
      iconType: AntDesign,
      iconName: "user",
    },
  },
];

const UserTab = () => {
  return CustomBottomTab(userTabValue);
};

export default UserTab;
