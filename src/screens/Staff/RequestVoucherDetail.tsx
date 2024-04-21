import {
  View,
  Text,
  Image,
  Button,
  useToast,
  Modal,
  FormControl,
  Input,
} from "native-base";
import React, { useContext, useState } from "react";
import { ImageBackground } from "react-native";
import { FormatDate, FormatDateTime } from "../../utils/DateTimeFormatter";
import { AxiosContext } from "../../context/AxiosContext";

const RequestVoucherDetail = ({ navigation, route }: any) => {
  const { voucher } = route.params;
  const { authAxios } = useContext(AxiosContext);
  const toast = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  console.log("voucher", voucher);

  const handleChangeVoucherStatus = async (status: string) => {
    console.log("status", status, rejectReason);
    if (status === "reject" && !rejectReason) {
      toast.show({
        title: "Error",
        description: "Please provide a reason to reject this voucher",
      });
      return;
    }
    try {
      const response = await authAxios.patch(
        `/vouchers/${voucher._id}/status`,
        {
          status: status,
          rejectReason: rejectReason || null,
        }
      );
      if (response.data.message === "Success") {
        setRejectReason(null);
        setShowModal(false);
        if (status === "reject") {
          navigation.goBack();
          toast.show({
            title: "Success",
            description: "Voucher has been rejected",
          });
        } else {
          navigation.goBack();
          toast.show({
            title: "Success",
            description: "Voucher status has been updated",
          });
        }
      } else {
        toast.show({
          title: "Error",
          description: "Failed to update voucher status",
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
    <View>
      <ImageBackground
        source={require("../../../assets/background.png")}
        resizeMode="cover"
      >
        <Image
          source={{ uri: voucher.imageUrl }}
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
          height={515}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="white"
          roundedTop="xl"
          paddingTop={90}
          paddingBottom={10}
        >
          <Text className="text-3xl font-bold">{voucher.name}</Text>
          <Text className="text-xl font-semibold">{voucher.discount}% OFF</Text>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Price: </Text>
            <Text className="text-xl">
              {voucher.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              VND
            </Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Host username: </Text>
            <Text className="text-lg">{voucher.host?.username || ""}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">Start use time: </Text>
            <Text className="text-lg">{FormatDate(voucher.startUseTime)}</Text>
          </View>
          <View
            width={"80%"}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text className="text-lg">End use time: </Text>
            <Text className="text-lg">{FormatDate(voucher.endUseTime)}</Text>
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
                onPress={() => handleChangeVoucherStatus("available")}
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
                onPress={() => setShowModal(true)}
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
              bg={"red.500"}
              _pressed={{
                bg: "red.700",
              }}
              onPress={() => setShowModal(true)}
            >
              Disable
            </Button>
          )}
          {voucher.status === "reject" && (
            <Button
              marginTop={20}
              variant={"solid"}
              rounded="full"
              bg={"green.500"}
              _pressed={{
                bg: "green.700",
              }}
              onPress={() => handleChangeVoucherStatus("available")}
            >
              Approve
            </Button>
          )}
        </View>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.Header>
              Please provide some reasons to reject this voucher
            </Modal.Header>
            <Modal.Body>
              <FormControl>
                <Input
                  // w={{
                  //   base: "80%",
                  // }}
                  placeholder="Enter reason"
                  rounded="full"
                  _focus={{
                    borderColor: "black",
                    backgroundColor: "gray.200",
                  }}
                  onChangeText={(value) => setRejectReason(value || null)}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  rounded="full"
                  variant="outline"
                  _text={{ color: "black" }}
                  _pressed={{
                    bg: "gray.300",
                  }}
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  rounded="full"
                  bg={"black"}
                  onPress={() => handleChangeVoucherStatus("reject")}
                  _pressed={{
                    bg: "gray.500",
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </ImageBackground>
    </View>
  );
};

export default RequestVoucherDetail;
