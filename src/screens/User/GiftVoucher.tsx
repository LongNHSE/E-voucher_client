// import { View, Text } from "native-base";
// import React, { useEffect, useState } from "react";
// import { useRoute } from "@react-navigation/native";
// import { StyleSheet, TouchableOpacity } from "react-native";
// import * as Camera from "expo-camera";
// import { BarCodeScanner } from "expo-barcode-scanner";

// interface Voucher {
//   _id: string;
//   voucherId: string;
//   userId: string;
//   giftUserId: string;
//   status: string;
//   genrateAt: string;
//   description: string;
//   price: number;
// }

// const GiftVoucher = () => {
//   async function requestPermission() {
//     const { status } = await Camera.Camera.getCameraPermissionsAsync();
//     if (status !== "granted") {
//       alert("Sorry, we need camera permissions to make this work!");
//     }
//   }
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     alert(`Bar code with type ${type} and data ${data} has been scanned!`);
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   const route = useRoute();
//   const voucher: Voucher = route.params;
//   console.log(voucher);
//   return (
//     <View style={styles.container}>
//       <View style={styles.QRCode}>
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//         />
//         {/* <QRCode
//           value={JSON.stringify({
//             voucher,
//           })}
//           size={400}
//         ></QRCode> */}
//         {/* <QRCodeScanner
//           onRead={onSuccess}
//           flashMode={RNCamera.Constants.FlashMode.torch}
//           topContent={
//             <Text style={styles.centerText}>
//               Go to{" "}
//               <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
//               your computer and scan the QR code.
//             </Text>
//           }
//           bottomContent={
//             <TouchableOpacity style={styles.buttonTouchable}>
//               <Text style={styles.buttonText}>OK. Got it!</Text>
//             </TouchableOpacity>
//           }
//         /> */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignContent: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     // semi-transparent black background
//   },
//   centerText: {
//     flex: 1,
//     fontSize: 18,
//     padding: 32,
//     color: "#777",
//   },
//   textBold: {
//     fontWeight: "500",
//     color: "#000",
//   },
//   buttonText: {
//     fontSize: 21,
//     color: "rgb(0,122,255)",
//   },
//   buttonTouchable: {
//     padding: 16,
//   },
//   QRCode: {
//     alignContent: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     width: 100,
//     height: 100,
//   },
// });
// export default GiftVoucher;

import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GiftVoucher() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
