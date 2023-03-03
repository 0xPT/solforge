import React from "react";
import {
  Box,
  useDisclosure,
  Text,
  Flex,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

interface IListItem {
  name: string;
  values:
    | {
        name: string;
        type: string;
      }[]
    | string[];
}

const ListItems = [
  {
    name: "Modifiers",
    values: ["onlyOwner"],
  },
  {
    name: "Functions",
    values: ["getListOfUsersWhoAdded", "addToOriginalNumber"],
  },
  {
    name: "Variables",
    values: [
      {
        name: "originalNumber",
        type: "uint256",
      },
      {
        name: "totalNumber",
        type: "uint256",
      },
      {
        name: "usersWhoAdded",
        type: "address",
      },
      {
        name: "testString",
        type: "string",
      },
      {
        name: "testInt",
        type: "int256",
      },
      {
        name: "testStruct",
        type: "struct",
      },
      {
        name: "testMap",
        type: "map",
      },
    ],
  },
];

const getColorOfType = (type: string) => {
  switch (type) {
    case "uint256":
      return "green.500";
    case "string":
      return "pink.500";
    case "address":
      return "yellow.500";
    case "int256":
      return "blue.500";
    case "struct":
      return "purple.500";
    case "map":
      return "orange.500";
    default:
      return "zinc.500";
  }
};

const SideList = ({ name, values }: IListItem) => {
  return (
    <Flex mt={8} direction="column" color="zinc.500">
      <Flex justifyContent="space-between" width="full">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing={0.1}
        >
          {name}
        </Text>
        <Icon as={FiPlus} />
      </Flex>
      <List
        color="zinc.400"
        fontSize="xs"
        spacing={1}
        mt={2}
        letterSpacing={0.2}
      >
        {values.map((value, index) => {
          if (typeof value === "string") {
            return (
              <ListItem key={index}>
                <Text>{value}</Text>
              </ListItem>
            );
          }

          return (
            <ListItem key={index}>
              <Flex justifyContent="space-between" width="full">
                <Text>{value.name}</Text>
                <Text color={getColorOfType(value.type)}>{value.type}</Text>
              </Flex>
            </ListItem>
          );
        })}
      </List>
    </Flex>
  );
};

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      pos="fixed"
      minH="100vh"
      bg="zinc.900"
      borderRight="1px"
      borderColor="zinc.700"
      width={300}
      zIndex={1}
    >
      <Flex direction="column" paddingLeft={18} paddingRight={18}>
        {ListItems.map((listItem, index) => {
          return (
            <SideList
              key={index}
              name={listItem.name}
              values={listItem.values}
            />
          );
        })}
      </Flex>
    </Box>
  );
}
