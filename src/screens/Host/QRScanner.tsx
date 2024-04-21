import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AxiosContext } from "../../context/AxiosContext";
import Spinner from "../../components/Spinner";
import * as Device from "expo-device";
interface VoucherScanned {
  voucher: {
    voucher_id: string;
    hash: string;
  };
}

export default function QRScanner() {
  const { publicAxios } = useContext(AxiosContext);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleQRCodeScanned = async (data) => {
    const dataObject = JSON.parse(data);
    console.log(dataObject);
    if (!dataObject.voucher_id || !dataObject.hash) {
      Alert.alert("Error", "Invalid QR Code", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
      return;
    }
    setLoading(true);
    try {
      const response = await publicAxios.post("/voucherSell/QRCode", {
        voucherId: dataObject.voucher_id,
        hash: dataObject.hash,
      });
      console.log(response.data);
      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.response.data.message, [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {loading && <Spinner />}
      {permission && Device.isDevice && (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={(barcode) => {
            if (scanned) return;
            setScanned(true);
            handleQRCodeScanned(barcode.data);
          }}
        >
          <View style={styles.buttonContainer}>
            <View style={styles.topLeftCorner} />
            <View style={styles.topRightCorner} />
            <View style={styles.bottomLeftCorner} />
            <View style={styles.bottomRightCorner} />
          </View>
        </CameraView>
      )}
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
  topLeftCorner: {
    position: "absolute",
    top: 100,
    left: 0,
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderColor: "white",
    height: 50,
    width: 50,
  },
  topRightCorner: {
    position: "absolute",
    top: 100,
    right: 0,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderColor: "white",
    height: 50,
    width: 50,
  },
  bottomLeftCorner: {
    position: "absolute",
    bottom: 100,
    left: 0,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderColor: "white",
    height: 50,
    width: 50,
  },
  bottomRightCorner: {
    position: "absolute",
    bottom: 100,
    right: 0,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: "white",
    height: 50,
    width: 50,
  },
});
