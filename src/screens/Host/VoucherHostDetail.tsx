import { View, Text, Image, Button } from "native-base";
import React from "react";
import { ImageBackground } from "react-native";

const VoucherHostDetail = ({ route }: any) => {
  const { voucher } = route.params;
  return (
    <View>
      <ImageBackground
        source={require("../../../assets/graybackground.png")}
        resizeMode="cover"
      >
        <Image
          source={voucher.image}
          alt="voucher"
          size={40}
          rounded="full"
          alignSelf={"center"}
          position={"relative"}
          top={20}
          zIndex={1}
        />
        <View
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="white"
          rounded="xl"
          paddingTop={90}
          paddingBottom={10}
        >
          <Text className="text-3xl font-bold">{voucher.name}</Text>
          <Text className="text-xl font-semibold">{voucher.discount}</Text>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Price: </Text>
            <Text className="text-xl">{voucher.price} VND</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">User name: </Text>
            <Text className="text-lg">{voucher.userName}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Start use time: </Text>
            <Text className="text-lg">{voucher.startUseTime}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">End use time: </Text>
            <Text className="text-lg">{voucher.endUseTime}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Status: </Text>
            <Text className="text-lg">{voucher.status}</Text>
          </View>
          {voucher.status === "pending" && (
            <View
              style={{
                marginTop: 20,
                width: "80%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant={"solid"}
                rounded="full"
                bg={"green.500"}
                _pressed={{
                  bg: "green.700",
                }}
              >
                Approve
              </Button>
              <Button
                variant={"solid"}
                rounded="full"
                bg={"red.500"}
                _pressed={{
                  bg: "red.700",
                }}
              >
                Reject
              </Button>
            </View>
          )}
          {voucher.status === "available" && (
            <Button
              marginTop={20}
              variant={"solid"}
              rounded="full"
            width="100%"
              bg={"red.500"}
              _pressed={{
                bg: "red.700",
              }}
            >
              Unavailable Voucher
            </Button>
          )}
          {voucher.status === "rejected" && (
           <Text>Reject reson</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default VoucherHostDetail;
