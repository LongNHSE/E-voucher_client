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
  Divider,
  Icon,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { Switch } from "react-native";
import { AxiosContext } from "../../context/AxiosContext";
import { AntDesign } from "@expo/vector-icons";

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
  _id: string;
  duration: string;
  isActive: boolean;
}

interface ReportType {
  _id: string;
  name: string;
}

const Config = () => {
  const focus = useIsFocused();
  const toast = useToast();
  const { authAxios } = useContext(AxiosContext);
  const [timeLimit, setTimeLimit] = useState<TimeLimit[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [reportType, setReportType] = useState<ReportType[]>([]);
  const [newReportType, setNewReportType] = useState<string>("");

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

  const fetchReportType = async () => {
    try {
      const response = await authAxios.get("/reportTypes");
      if (response.data.message === "Success") {
        setReportType(response.data.data);
      } else {
        toast.show({
          title: "Error",
          description: "Failed to fetch report type",
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
      fetchReportType();
    }
  }, [focus]);

  const handleChangeTimeLimit = async (id: string) => {
    if (openEdit === false) setOpenEdit(!openEdit);
    else {
      try {
        if (duration > 0) {
          const response = await authAxios.patch(`/timeLimits/${id}`, {
            duration: duration,
          });
          if (response.data.message === "Success") {
            toast.show({
              title: "Success",
              description: "Time limit updated",
            });
            setOpenEdit(!openEdit);
          } else {
            toast.show({
              title: "Error",
              description: "Failed to update time limit",
            });
          }
        } else {
          toast.show({
            title: "Error",
            description: "Time must be greater than 0",
          });
        }
      } catch (error) {
        toast.show({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  };
  const handleDeleteReportType = async (id: string) => {
    try {
      const response = await authAxios.delete(`/reportTypes/${id}`);
      if (response.data.message === "Success") {
        fetchReportType();
        setShowDeleteModal(false);
        toast.show({
          title: "Success",
          description: "Report type deleted",
        });
      } else {
        toast.show({
          title: "Error",
          description: "Failed to delete report type",
        });
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };
  const handleAddReportType = async () => {
    try {
      const response = await authAxios.post("/reportTypes", {
        name: newReportType,
      });
      if (response.data.message === "Success") {
        fetchReportType();
        setShowModal(false);
        toast.show({
          title: "Success",
          description: "Report type added",
        });
      } else {
        toast.show({
          title: "Error",
          description: "Failed to add report type",
        });
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  // const handleAddTimeLimit = async () => {
  //   try {
  //     if (duration <= 0) {
  //       toast.show({
  //         title: "Error",
  //         description: "Time must be greater than 0",
  //       });
  //       return;
  //     }
  //     const response = await authAxios.post("/timeLimits", {
  //       duration,
  //       isActive: false,
  //     });
  //     if (response.data.message === "Success") {
  //       fetchTimeLimit();
  //       toast.show({
  //         title: "Success",
  //         description: "Time limit added",
  //       });
  //       setDuration(0);
  //       setShowModal(false);
  //     } else {
  //       toast.show({
  //         title: "Error",
  //         description: "Time limit is duplicated",
  //       });
  //       setDuration(0);
  //     }
  //   } catch (error) {
  //     toast.show({
  //       title: "Error",
  //       description: "Something went wrong",
  //     });
  //   }
  // };
  return (
    <ScrollView className="pt-4 px-4">
      <Heading fontSize="2xl" textAlign="center">
        Set up voucher sell time
      </Heading>
      {timeLimit.map((time) => (
        <View
          key={time._id}
          marginY={3}
          marginX={2}
          padding={3}
          background={"white"}
          borderStyle={"solid"}
          borderColor={"gray.200"}
          borderWidth={1}
          borderRadius="3xl"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Input
            placeholder="Enter time (hour)"
            w={"80%"}
            _focus={
              openEdit
                ? {
                    borderColor: "black",
                    backgroundColor: "gray.200",
                  }
                : {}
            }
            keyboardType="numeric"
            rounded="full"
            defaultValue={time.duration.toString()}
            isReadOnly={openEdit === false}
            onChangeText={(value) => setDuration(parseInt(value) || 0)}
          />
          <Button
            rounded="full"
            bg={"black"}
            _pressed={{
              bg: "gray.500",
            }}
            onPress={() => handleChangeTimeLimit(time._id)}
          >
            {openEdit ? "Save" : "Edit"}
          </Button>
          {/* <Text fontSize="lg">{time.duration} hour</Text> */}
          {/* <Switch
            trackColor={{ false: "#999999", true: "#000000" }}
            thumbColor={"#f4f3f4"}
            value={time.isActive}
            onValueChange={() => handleChangeTimeLimit(time.id)}
          /> */}
        </View>
      ))}
      <Divider my={4} />
      <Heading fontSize="2xl" textAlign="center">
        Set up report type
      </Heading>
      {reportType.map((report) => (
        <View
          key={report._id}
          marginY={3}
          marginX={2}
          padding={3}
          background={"white"}
          borderStyle={"solid"}
          borderColor={"gray.200"}
          borderWidth={1}
          borderRadius="3xl"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="lg">{report.name}</Text>
          <Icon
            as={AntDesign}
            name="close"
            size={7}
            onPress={() => setShowDeleteModal(true)}
          />
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          >
            <Modal.Content maxWidth="400px">
              <Modal.Header>Delete report type</Modal.Header>
              <Modal.Body>
                <Text>Are you sure you want to delete this report type?</Text>
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
                      setShowDeleteModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    rounded="full"
                    bg={"black"}
                    onPress={() => handleDeleteReportType(report._id)}
                    _pressed={{
                      bg: "gray.500",
                    }}
                  >
                    Delete
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
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
        Add new report type
      </Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Add new report type</Modal.Header>
          <Modal.Body>
            <FormControl>
              <Input
                // w={{
                //   base: "80%",
                // }}
                placeholder="Enter time"
                rounded="full"
                _focus={{
                  borderColor: "black",
                  backgroundColor: "gray.200",
                }}
                // onChangeText={(value) => setDuration(parseInt(value) || 0)}
                // value={duration.toString()}
                value={newReportType}
                onChangeText={(value) => setNewReportType(value)}
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
                onPress={() => handleAddReportType()}
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

export default Config;
