import { View, Text, Button, AlertDialog } from "native-base";
import React from "react";

const ConfirmDialog = ({
  navigation,
  isOpenDialog,
  setIsOpenDialog,
  title,
  message,
}: any) => {
  const cancelRef = React.useRef(null);

  const onClose = () => setIsOpenDialog(false);

  return (
    <View>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpenDialog}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Text>{title}</Text>
          </AlertDialog.Header>
          <AlertDialog.Body>{message}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={onClose}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
};

export default ConfirmDialog;
