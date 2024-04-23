import {
  View,
  Text,
  Heading,
  Image,
  Button,
  ScrollView,
  Input,
  useToast,
} from "native-base";
import React, { useContext, useState } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import { AuthContext } from "../../context/AuthContext";

const ReportDetail = ({ route, navigation }: any) => {
  const toast = useToast();
  const { report } = route.params;
  const { authAxios } = useContext(AxiosContext);
  const authContext: any = useContext(AuthContext);
  const [showResponseForm, setShowResponseForm] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const handleSubmitResponse = async () => {
    console.log("response", response);
    console.log("user", authContext.authState.user);
    try {
      const res = await authAxios.patch(`/reports/${report._id}`, {
        staffMessage: response,
        staff: authContext.authState.user._id,
      });
      if (res.data.message === "Success") {
        setShowResponseForm(false);
        setResponse("");
        navigation.goBack();
        toast.show({
          title: "Success",
          description: "Response submitted",
        });
      } else {
        setShowResponseForm(false);
        toast.show({
          title: "Error",
          description: "Failed to submit response",
        });
      }
    } catch (error: any) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
      console.log("error", error.message);
    }
  };
  return (
    <ScrollView>
      <View className="m-4">
        <View className="mb-2">
          <Heading className="text-center text-2xl font-extrabold">
            {report.voucherSell.voucherId.name}
          </Heading>
        </View>
        <Image
          source={{
            uri: report?.voucherSell?.voucherId?.imageUrl,
          }}
          alt="voucher"
          size={40}
          rounded="full"
          // marginRight={1}
          alignSelf={"center"}
        />
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "auto",
            margin: 10,
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 20,
            alignSelf: "center",
            padding: 10,
          }}
        >
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Voucher Code:
            </Text>
            <Text fontSize="lg">{report.voucherSell.voucherId.code}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Percentage Discount:
            </Text>
            <Text fontSize="lg">
              {report.voucherSell.voucherId.discount}{" "}
              {report.voucherSell.voucherId.discountType === "percentage" &&
                "%"}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Price:
            </Text>
            <Text fontSize="lg">
              {report.voucherSell.voucherId.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              VND
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Category:
            </Text>
            <Text fontSize="lg">{report.voucherSell.voucherId.category}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Repor username:
            </Text>
            <Text fontSize="lg">{report.user.username}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Report type:
            </Text>
            <Text fontSize="lg">{report.reportType.name}</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "auto",
            margin: 10,
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 20,
            alignSelf: "center",
            padding: 10,
          }}
        >
          <Text fontSize="xl" className="font-bold text-center">
            Report message
          </Text>
          <Text fontSize="lg" textAlign="center">
            {report.userMessage}
          </Text>
        </View>

        {(report.staff || report.staffMessage) && (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "auto",
              margin: 10,
              borderStyle: "solid",
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 20,
              alignSelf: "center",
              padding: 10,
            }}
          >
            <Text fontSize="xl" className="font-bold text-center">
              Answer message
            </Text>
            <Text fontSize="lg" textAlign="center">
              {report.staffMessage}
            </Text>
          </View>
        )}

        {showResponseForm === true && (
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "auto",
              margin: 10,
              borderStyle: "solid",
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 20,
              alignSelf: "center",
              padding: 10,
            }}
          >
            <Input
              placeholder="Response"
              multiline={true}
              numberOfLines={3}
              rounded="full"
              _focus={{
                bg: "gray.200",
                borderColor: "gray.200",
              }}
              value={response || ""}
              onChange={(e) => setResponse(e.nativeEvent.text)}
            />
            <Button
              variant={"solid"}
              bg={"black"}
              marginTop="4"
              rounded="full"
              _pressed={{ bg: "gray.500" }}
              onPress={handleSubmitResponse}
            >
              Submit
            </Button>
          </View>
        )}
        {!(report.staff || report.staffMessage) &&
          showResponseForm === false && (
            <Button
              variant={"solid"}
              bg={"black"}
              rounded="full"
              _pressed={{ bg: "gray.500" }}
              onPress={() => setShowResponseForm(true)}
            >
              Write response
            </Button>
          )}
      </View>
    </ScrollView>
  );
};

export default ReportDetail;
