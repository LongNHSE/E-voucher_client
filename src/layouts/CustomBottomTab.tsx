import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { View, Text, Icon } from "native-base";
import React from "react";

const Tab = createMaterialBottomTabNavigator();

export interface TabBarProps {
  route: string;
  component: React.FC;
  tabBarLabel: string;
  tabBarIconProps: {
    iconType: any;
    iconName: string;
  };
}

// const CustomBottomTab: React.FC<TabBarProps[]> = (tabBarProps) => {
const CustomBottomTab: React.FC<TabBarProps[]> = (tabBarProps) => {
  return (
    <Tab.Navigator
      initialRouteName={tabBarProps[0].route}
      shifting={true}
      activeColor="#0080FF"
      barStyle={{
        borderRadius: 20,
        height: 70,
        backgroundColor: "white",
      }}
      activeIndicatorStyle={{ opacity: 0 }}
    >
      {tabBarProps.map((tabProps: TabBarProps, idx) => (
        <Tab.Screen
          key={idx}
          name={tabProps.route}
          component={tabProps.component}
          options={{
            tabBarLabel: tabProps.tabBarLabel,
            tabBarIcon: ({ color }) => (
              <Icon
                as={tabProps.tabBarIconProps.iconType}
                name={tabProps.tabBarIconProps.iconName}
                color={color}
                size={5}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default CustomBottomTab;
