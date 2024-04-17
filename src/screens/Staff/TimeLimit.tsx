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
} from "native-base";
import React, { useState } from "react";
import { Switch } from "react-native";

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
  // {
  //   id: 3,
  //   duration: "6 hours",
  //   active: false,
  // },
];

const TimeLimit = () => {
  const [timeLimit, setTimeLimit] = useState<Array<any>>(timeLimitData);
  const [showModal, setShowModal] = useState<boolean>(false);
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
          <Text fontSize="lg">{time.duration}</Text>
          <Switch
            // trackColor="black"
            // size="lg"
            // alignSelf="baseline"
            // isChecked={time.active}
            // onToggle={() => {
            //   console.log("Switched");
            // }}
            trackColor={{ false: "#999999", true: "#000000" }}
            thumbColor={"#f4f3f4"}
            value={time.active}
            onValueChange={() => {
              setTimeLimit(
                timeLimit.map((item) =>
                  item.id === time.id ? { ...item, active: !item.active } : item
                )
              );
            }}
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
                onPress={() => {
                  setShowModal(false);
                }}
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
