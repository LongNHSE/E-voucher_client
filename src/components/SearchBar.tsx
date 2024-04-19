import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Box, Divider, Heading, Icon, Input, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <VStack w="100%" space={5} alignSelf="center">
      <Heading fontSize="lg">Cupertino</Heading>
      <Input
        placeholder="Search"
        variant="filled"
        width="100%"
        borderRadius="10"
        py="1"
        px="2"
        InputLeftElement={
          <Icon
            ml="2"
            size="4"
            color="gray.400"
            as={<Ionicons name="ios-search" />}
          />
        }
      />
    </VStack>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
