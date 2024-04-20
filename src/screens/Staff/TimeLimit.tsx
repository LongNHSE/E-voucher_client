import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  Heading,
  Button,
  Modal,
  FormControl,
  Input,
  InputRightAddon,
  InputGroup,
  useToast,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { Switch } from "react-native";
import { AxiosContext } from "../../context/AxiosContext";

const timeLimitData = [
  {
    id: 1,
    duration: "2 hours",
    active: true,
  },
  {
    id: 2,
    duration: "4 hours",
    active: false,
  },
];

interface TimeLimit {
  id: number;
  duration: string;
  isActive: boolean;
}

const TimeLimit = () => {
  const focus = useIsFocused();
  const toast = useToast();
  const { authAxios } = useContext(AxiosContext);
  const [timeLimit, setTimeLimit] = useState<TimeLimit[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchTimeLimit = async () => {
    try {
      const response = await authAxios.get("/timeLimits");
      if (response.data.message === "Success") {
        setTimeLimit(response.data.data);
      } else {
        toast.show({
          title: "Error",
          description: "Failed to fetch time limit",
        });
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    if (focus) {
      fetchTimeLimit();
    }
  }, [focus]);

  const handleChangeTimeLimit = async (id: number) => {
    const newTimeLimit = timeLimit.map((time) => {
      if (time.id === id) {
        return {
          ...time,
          isActive: !time.isActive,
        };
      }
      return time;
    });
    setTimeLimit(newTimeLimit);
    try {
      const response = await authAxios.patch(`/timeLimits/${id}`, {
        isActive: newTimeLimit.find((time) => time.id === id)?.isActive,
      });
      if (response.data.message === "Success") {
        toast.show({
          title: "Success",
          description: "Time limit updated",
        });
      } else {
        toast.show({
          title: "Error",
          description: "Failed to update time limit",
        });
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  const handleAddTimeLimit = async () => {
    try {
      if (duration <= 0) {
        toast.show({
          title: "Error",
          description: "Time must be greater than 0",
        });
        return;
      }
      const response = await authAxios.post("/timeLimits", {
        duration,
        isActive: false,
      });
      if (response.data.message === "Success") {
        fetchTimeLimit();
        toast.show({
          title: "Success",
          description: "Time limit added",
        });
        setDuration(0);
        setShowModal(false);
      } else {
        toast.show({
          title: "Error",
          description: "Time limit is duplicated",
        });
        setDuration(0);
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };
  return (
    <ScrollView className="mt-4 mx-4">
      <Heading fontSize="2xl">Set up voucher sell time</Heading>
      {timeLimit.map((time) => (
        <View
          key={time.id}
          marginY={3}
          marginX={2}
          padding={3}
          background={"white"}
          borderStyle={"solid"}
          borderColor={"gray.200"}
          borderWidth={1}
          borderRadius="3xl"
          shadow={2}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="lg">{time.duration} hour</Text>
          <Switch
            trackColor={{ false: "#999999", true: "#000000" }}
            thumbColor={"#f4f3f4"}
            value={time.isActive}
            onValueChange={() => handleChangeTimeLimit(time.id)}
          />
        </View>
      ))}
      <Button
        marginTop={10}
        variant={"solid"}
        rounded="full"
        bg={"black"}
        _pressed={{
          bg: "gray.500",
        }}
        onPress={() => setShowModal(true)}
      >
        Add new time
      </Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Add new time</Modal.Header>
          <Modal.Body>
            <FormControl>
              <InputGroup>
                <Input
                  w={{
                    base: "80%",
                  }}
                  placeholder="Enter time"
                  // rounded="full"
                  keyboardType="numeric"
                  _focus={{
                    borderColor: "black",
                    backgroundColor: "gray.200",
                  }}
                  onChangeText={(value) => setDuration(parseInt(value) || 0)}
                />
                <InputRightAddon rounded="full" children={"hour"} />
              </InputGroup>
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
                onPress={() => handleAddTimeLimit()}
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
    </ScrollView>
  );
};

export default TimeLimit;
