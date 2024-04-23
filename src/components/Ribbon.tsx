import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
export default function Ribbon({
  text,
  color = "red",
  width = 90,
  height = 30,
  right = -7,
  top = 10,
}) {
  return (
    <View
      style={{
        width: width,
        height: height,
        position: "absolute",
        right: right,
        top: top,
        zIndex: 1,
        backgroundColor: color,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 15,
        transform: [{ scaleX: -1 }],
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          transform: [{ scaleX: -1 }],
        }}
      >
        {text ? text : "New"}
      </Text>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: -8.5,
          width: 0,
          height: 0,
          borderLeftWidth: 9,
          borderBottomWidth: 9,
          borderLeftColor: "transparent",
          borderBottomColor: "black",
        }}
      />
      <View
        style={{
          position: "absolute",
          right: -14.5,
          width: 0,
          height: 0,
          borderLeftWidth: 15,
          borderTopWidth: height ? height / 2 : 15,
          borderBottomWidth: height ? height / 2 : 15,
          borderLeftColor: color ? color : "red",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />
    </View>
  );
}
