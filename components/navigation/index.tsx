import React, { useMemo } from "react";
import {
  Box,
  Text,
  Flex,
  Icon,
  List,
  ListItem,
  IconButton,
} from "@chakra-ui/react";
import { FiChevronsLeft, FiChevronsRight, FiPlus } from "react-icons/fi";
import { EFunctionType, ENodeType } from "@/types";
import { getColorOfType } from "@/utils";
import { useNodes } from "reactflow";
import { traverseAST } from "@/utils/Traverse";
import output from "../../output.json";

const StateVariables = () => {
  const nodes = useNodes();
  const stateVariables = useMemo(() => {
    return traverseAST(output as any)?.stateVariables;
  }, [nodes]);

  const onDragStart = (event: any, nodeType: string, name: string) => {
    event.dataTransfer.setData("node-label", name);
    event.dataTransfer.setData("node-type", nodeType);
  };

  return (
    <Box mt={4}>
      <Flex justifyContent="space-between" alignItems="center" width="full">
        <Text
          style={{
            fontFeatureSettings: "'ss02' on",
          }}
          fontSize="12px"
          fontWeight="500"
          textTransform="uppercase"
          lineHeight={0.6}
          letterSpacing="0.1em"
          color="#fff"
        >
          Variables
        </Text>
        <IconButton
          bg="transparent"
          size="sm"
          aria-label="add a variable"
          icon={<FiPlus />}
        />
      </Flex>
      <List
        color="zinc.400"
        fontSize="xs"
        spacing={1}
        mt={2}
        letterSpacing={0.2}
      >
        {stateVariables.map((value, index) => {
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
              onDragStart={(e) =>
                onDragStart(e, ENodeType.VARIABLE_NODE, value.name)
              }
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
    </Box>
  );
};

const Functions = () => {
  const nodes = useNodes();
  const functionNodes: any[] = nodes.filter((node) => {
    return (
      node.type === ENodeType.FUNCTION_NODE &&
      (node.data as any).operation === EFunctionType.START
    );
  });

  const onDragStart = (event: any, func: any) => {
    event.dataTransfer.setData("node-label", func.name);
    event.dataTransfer.setData("node-type", ENodeType.FUNCTION_NODE);
  };

  return (
    <Box mt={6}>
      <Flex justifyContent="space-between" alignItems="center" width="full">
        <Text
          style={{
            fontFeatureSettings: "'ss02' on",
          }}
          fontSize="12px"
          fontWeight="500"
          textTransform="uppercase"
          lineHeight={0.6}
          letterSpacing="0.1em"
          color="#fff"
        >
          Functions
        </Text>
        <IconButton
          bg="transparent"
          size="sm"
          aria-label="add a variable"
          icon={<FiPlus />}
        />
      </Flex>
      <List
        color="zinc.400"
        fontSize="xs"
        spacing={1}
        mt={2}
        letterSpacing={0.2}
      >
        {functionNodes.map((functionNode, index) => {
          return (
            <Box>
              <ListItem
                _hover={{
                  cursor: "grab",
                }}
                _active={{
                  cursor: "grabbing",
                }}
                _grabbed={{ cursor: "grabbing" }}
                draggable
                onDragStart={(e) => onDragStart(e, functionNode)}
                key={index}
              >
                <Flex justifyContent="space-between" width="full">
                  <Text>{functionNode.data.label.split(" ")[0]}</Text>
                </Flex>
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const width = isOpen ? 300 : 100;
  const icon = isOpen ? <FiChevronsLeft /> : <FiChevronsRight />;
  return (
    <Flex
      direction="column"
      alignItems={isOpen ? "flex-end" : "center"}
      pos="fixed"
      minH="100vh"
      bg="#1c1e2a"
      borderRight="2px"
      borderColor="#34384e"
      width={width}
      zIndex={100}
    >
      <Flex
        w="full"
        flex={1}
        display={isOpen ? "flex" : "none"}
        direction="column"
        paddingLeft={18}
        paddingRight={18}
      >
        <StateVariables />
        <Functions />
      </Flex>
      <IconButton
        bg="transparent"
        maxW={10}
        ml="auto"
        mt={isOpen ? 0 : "auto"}
        m={4}
        aria-label="Toggle Sidebar"
        icon={icon}
        onClick={() => setIsOpen(!isOpen)}
      />
    </Flex>
  );
}
