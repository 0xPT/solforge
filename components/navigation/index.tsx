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
import { EDataType, ENodeType } from "@/types";
import { getColorOfType } from "@/utils";

interface IListItem {
  name: string;
  values:
    | {
        name: string;
        type: EDataType;
        nodeType: ENodeType;
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
        type: EDataType.UINT_256,
        nodeType: ENodeType.VARIABLE_NODE,
      },
      {
        name: "totalNumber",
        type: EDataType.UINT_256,
        nodeType: ENodeType.VARIABLE_NODE,
      },
      {
        name: "usersWhoAdded",
        type: EDataType.ADDRESS,
        nodeType: ENodeType.VARIABLE_NODE,
      },
      {
        name: "testString",
        type: EDataType.STRING,
        nodeType: ENodeType.VARIABLE_NODE,
      },
      {
        name: "testInt",
        type: EDataType.INT_256,
        nodeType: ENodeType.VARIABLE_NODE,
      },
      {
        name: "testStruct",
        type: EDataType.STRUCT,
        nodeType: ENodeType.VARIABLE_NODE,
      },
      {
        name: "testMap",
        type: EDataType.MAPPING,
        nodeType: ENodeType.VARIABLE_NODE,
      },
    ],
  },
];

const SideList = ({ name, values }: IListItem) => {
  const onDragStart = (event: any, nodeType: string, name: string) => {
    event.dataTransfer.setData("node-label", name);
    event.dataTransfer.setData("node-type", nodeType);
  };

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
            <ListItem
              _hover={{
                cursor: "grab",
              }}
              _active={{
                cursor: "grabbing",
              }}
              _grabbed={{ cursor: "grabbing" }}
              draggable
              onDragStart={(e) => onDragStart(e, value.nodeType, value.name)}
              key={index}
            >
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
      bg="#1c1e2a"
      borderRight="2px"
      borderColor="#34384e"
      width={300}
      zIndex={100}
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
