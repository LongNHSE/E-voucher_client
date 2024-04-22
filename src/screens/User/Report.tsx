import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Divider } from "native-base";
import { AxiosContext } from "../../context/AxiosContext";
import { AuthContext } from "../../context/AuthContext";
import NotiDialog from "../../components/NotiDialog";

export default function Report({ navigation, route }: any) {
  const { voucherId, voucherSellId } = route.params;

  const [reportType, setReportType] = useState<any>([]);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [dialogStatus, setDialogStatus] = useState("");

  const [selectReport, setSelectReport] = useState<any>(null);

  const [reportReason, setReportrReason] = useState<string>("");

  const { authAxios, publicAxios } = useContext(AxiosContext);

  const authContext: any = useContext(AuthContext);

  const user = authContext.authState.user;

  const fetchData = async () => {
    const response = await publicAxios.get("/reportTypes");
    // console.log(response.data.data);
    setReportType(response.data.data);
  };

  const createVoucher = async () => {
    if (selectReport === null || reportReason === "") {
      setIsOpenDialog(true);
      setDialogStatus("empty");
      return;
    }

    const response = await authAxios.post("/reports", {
      voucher: voucherId,
      voucherSell: voucherSellId,
      user,
      userMessage: reportReason,
      reportType: selectReport,
    });

    if (response.data.statusCode >= 200 && response.data.statusCode < 300) {
      setIsOpenDialog(true);
      setDialogStatus("success");
    } else {
      setIsOpenDialog(true);
      setDialogStatus("fail");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Reason</Text>
      <StatusBar backgroundColor={"white"} />
      <View>
        <FlatList
          data={reportType}
          keyExtractor={(item) => "_" + item._id}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity
                  style={[
                    styles.reasonButton,
                    selectReport === item._id && {
                      backgroundColor: "lightgrey",
                    },
                    index === reportType?.length - 1 && {
                      borderBottomWidth: 1,
                    },
                  ]}
                  onPress={() => setSelectReport(item._id)}
                >
                  <Text style={styles.reasonName}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>

      <View style={{ marginHorizontal: 30 }}>
        <Text style={[styles.title, { marginLeft: 0, marginTop: 20 }]}>
          Describe Your Reason
        </Text>
        <TextInput
          multiline={true}
          numberOfLines={8}
          onChangeText={(text) => setReportrReason(text)}
          value={reportReason}
          style={styles.reportReasonText}
          placeholder="Write your reason here..."
        />
      </View>

      <View style={{ paddingHorizontal: 30, marginTop: 50 }}>
        <TouchableOpacity
          style={{
            width: "100%",
            backgroundColor: "#5BBCFF",
            paddingVertical: 15,
            alignItems: "center",
          }}
          onPress={() => createVoucher()}
        >
          <Text style={{ fontWeight: "bold", color: "white", fontSize: 16 }}>
            Report
          </Text>
        </TouchableOpacity>
      </View>

      {isOpenDialog && dialogStatus === "success" ? (
        <NotiDialog
          navigateFunc={() => navigation.goBack()}
          navigation={navigation}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          title={"Success"}
          message={"Report Successully!"}
        />
      ) : dialogStatus === "fail" ? (
        <NotiDialog
          //   navigateFunc={() => navigation.goBack()}
          navigation={navigation}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          title={"Fail"}
          message={"Report Fail!"}
        />
      ) : (
        dialogStatus === "empty" && (
          <NotiDialog
            //   navigateFunc={() => navigation.goBack()}
            navigation={navigation}
            isOpenDialog={isOpenDialog}
            setIsOpenDialog={setIsOpenDialog}
            title={"Fail"}
            message={"Please Fill All Field!!"}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "white",
  },

  title: {
    marginLeft: 30,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  reasonButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: "center",
    borderTopWidth: 0.5,
  },

  reasonName: {
    fontSize: 16,
  },

  reportReasonText: {
    borderWidth: 0.3,
    textAlignVertical: "top",
    padding: 10,
    fontSize: 16,
  },
});
