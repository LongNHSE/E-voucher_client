import {
  View,
  Text,
  Heading,
  Image,
  Button,
  ScrollView,
  Input,
} from "native-base";
import React, { useState } from "react";

const ReportDetail = ({ route }: any) => {
  const { report } = route.params;
  const [showResponseForm, setShowResponseForm] = useState<boolean>(false);
  return (
    <ScrollView>
      <View className="m-4">
        <View className="mb-2">
          <Heading className="text-center text-4xl font-extrabold">
            {report.voucherName}
          </Heading>
        </View>
        <Image
          source={report.image}
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
            <Text fontSize="lg">{report.voucherCode}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Percentage Discount:
            </Text>
            <Text fontSize="lg">{report.percentDiscount}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Number of report:
            </Text>
            <Text fontSize="lg">{report.numberOfReport}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Create date:
            </Text>
            <Text fontSize="lg">{report.createDate}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              User name:
            </Text>
            <Text fontSize="lg">{report.userName}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Role:
            </Text>
            <Text fontSize="lg">{report.role}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text fontSize="xl" className="font-semibold">
              Status:
            </Text>
            <Text fontSize="lg">{report.status}</Text>
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
          <View>
            <Text fontSize="xl" className="font-bold text-center">
              Report reason
            </Text>
            <Text fontSize="lg">{report.reportReason}</Text>
          </View>
        </View>

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
            />
            <Button
              variant={"solid"}
              bg={"black"}
              marginTop="4"
              rounded="full"
              _pressed={{ bg: "gray.500" }}
            >
              Submit
            </Button>
          </View>
        )}
        {showResponseForm === false && (
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
