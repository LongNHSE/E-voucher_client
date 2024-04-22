import { Box, Heading, Icon, Input, Select, View } from "native-base";
import { Animated, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height }: { width: any; height: any } = Dimensions.get("window");

const StickyHeader = ({
  header,
  filterList,
  scrollOffsetY,
  setFilterItem,
  // searchBar = true,
  filterBar = true,
}: {
  header: string;
  filterList: string[];
  scrollOffsetY: any;
  setFilterItem: React.Dispatch<React.SetStateAction<string>>;
  // searchBar?: boolean;
  filterBar?: boolean;
}) => {
  return (
    <Animated.View
      style={{
        backgroundColor: "#004165",
        transform: [
          {
            translateY: scrollOffsetY.interpolate({
              inputRange: [0, 50],
              outputRange: [0, -50],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
    >
      <Box
        width={width}
        p={2}
        bg={"white"}
        shadow={2}
        roundedBottom="2xl"
        justifyContent="center"
        alignItems="center"
      >
        <Heading>{header}</Heading>
        <View display="flex" flexDirection="row" justifyContent="space-between">
          {/* {searchBar && (
            <Input
              width={width / 1.7}
              marginRight={3}
              rounded="full"
              placeholder="Search voucher"
              marginY={2}
              InputLeftElement={
                <Icon as={MaterialIcons} name="search" size={8} ml={2} />
              }
              _focus={{
                backgroundColor: "coolGray.300",
                borderColor: "coolGray.300",
              }}
            />
          )} */}
          {filterBar && (
            <Select
              width={width - 100}
              marginY={2}
              rounded="full"
              onValueChange={(e) => setFilterItem(e)}
              defaultValue={filterList[0]?.toLowerCase()}
            >
              {filterList.map((item, idx) => {
                return (
                  <Select.Item
                    key={idx}
                    label={item}
                    value={item.toLowerCase()}
                  />
                );
              })}
            </Select>
          )}
        </View>
      </Box>
    </Animated.View>
  );
};

export default StickyHeader;
