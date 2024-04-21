import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import HostDashboard from "./HostDashboard";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import VoucherRequest from "./VoucherRequest";
import Setting from "../../components/Setting";

const hostTabValue: TabBarProps[] = [
  {
    route: "HostDashboard",
    component: HostDashboard,
    tabBarLabel: "Host Dashboard",
    tabBarIconProps: {
      iconType: FontAwesome,
      iconName: "dashboard",
    },
  },
  {
    route: "VoucherRequest",
    component: VoucherRequest,
    tabBarLabel: "VoucherRequest",
    tabBarIconProps: {
      iconType: FontAwesome5,
      iconName: "ticket-alt",
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
  // {
  //   route: "TimeLimit",
  //   component: TimeLimit,
  //   tabBarLabel: "Time",
  //   tabBarIconProps: {
  //     iconType: Ionicons,
  //     iconName: "time-outline",
  //   },
  // },
];

const HostTab = () => {
  return CustomBottomTab(hostTabValue);
};
export default HostTab;
