import { View, Text, Button, AlertDialog } from "native-base";
import React from "react";

const NotiDialog = ({
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
            <Text style={{ fontSize: 20, fontWeight: "500" }}>{title}</Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text style={{ fontSize: 14 }}>{message}</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="outline"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Got It
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
};

export default NotiDialog;
