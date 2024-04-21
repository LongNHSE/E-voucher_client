import CustomBottomTab, { TabBarProps } from "../../layouts/CustomBottomTab";
import StaffDashboard from "./StaffDashboard";
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import Config from "./Config";
import ReportList from "./ReportList";
import Setting from "../../components/Setting";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import QRScanner from "./QRScanner";
import QRCodeComponent from "../../components/QRCode";

const staffTabValue: TabBarProps[] = [
  {
    route: "StaffDashboard",
    component: StaffDashboard,
    tabBarLabel: "Request",
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: "pricetags-outline",
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
  // {
  //   route: "QRScanner",
  //   component: ReportList,
  //   tabBarLabel: "Report",
  //   tabBarIconProps: {
  //     iconType: FontAwesome,
  //     iconName: "list",
  //   },
  // },
  {
    route: "TimeLimit",
    component: Config,
    tabBarLabel: "Config",
    tabBarIconProps: {
      iconType: AntDesign,
      iconName: "tool",
    },
  },
  {
    route: "QRCode",
    component: QRCodeComponent,
    tabBarLabel: "QR Code",
    tabBarIconProps: {
      iconType: Ionicons,
      iconName: "qr-code-outline",
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
