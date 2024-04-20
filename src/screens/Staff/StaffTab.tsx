import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import StaffDashboard from "./StaffDashboard";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import TimeLimit from "./TimeLimit";
import ReportList from "./ReportList";
import Setting from "../../components/Setting";

const staffTabValue: TabBarProps[] = [
  {
    route: "StaffDashboard",
    component: StaffDashboard,
    tabBarLabel: "Voucher request",
    tabBarIconProps: {
      iconType: FontAwesome,
      iconName: "dashboard",
    },
  },
  {
    route: "ReportList",
    component: ReportList,
    tabBarLabel: "Report",
    tabBarIconProps: {
      iconType: FontAwesome,
      iconName: "list",
    },
  },
  {
    route: "QRScanner",
    component: ReportList,
    tabBarLabel: "Report",
    tabBarIconProps: {
      iconType: FontAwesome,
      iconName: "list",
    },
  },
  {
    route: "TimeLimit",
    component: TimeLimit,
    tabBarLabel: "Time",
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: "time-outline",
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

const StaffTab = () => {
  return CustomBottomTab(staffTabValue);
};
export default StaffTab;
