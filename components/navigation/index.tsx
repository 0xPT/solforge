import React, { useMemo, useState } from "react";
import {
  Box,
  Text,
  Flex,
  List,
  ListItem,
  IconButton,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiPlus,
} from "react-icons/fi";
import { EDataType, EFunctionType, ENodeType } from "@/types";
import { getColorOfType } from "@/utils";
import { useNodes } from "reactflow";
import { traverseAST } from "@/utils/Traverse";
import output from "../../output.json";
import { VariableIcon } from "../common/VariableIcon";

const VariableTypes = [
  {
    label: "Array",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.ARRAY,
    icon: <VariableIcon type={EDataType.ARRAY} />,
  },
  {
    label: "Boolean",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.BOOL,
    icon: <VariableIcon type={EDataType.BOOL} />,
  },
  {
    label: "Address",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.ADDRESS,
    icon: <VariableIcon type={EDataType.ADDRESS} />,
  },
  {
    label: "Uint_256",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.UINT_256,
    icon: <VariableIcon type={EDataType.UINT_256} />,
  },
  {
    label: "Int_256",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.INT_256,
    icon: <VariableIcon type={EDataType.INT_256} />,
  },
  {
    label: "Map",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.MAPPING,
    icon: <VariableIcon type={EDataType.MAPPING} />,
  },
  {
    label: "String",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.STRING,
    icon: <VariableIcon type={EDataType.STRING} />,
  },
  {
    label: "Struct",
    nodeType: ENodeType.VARIABLE_NODE,
    type: EDataType.STRUCT,
    icon: <VariableIcon type={EDataType.STRUCT} />,
  },
];

const StateVariables = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [addedVariables, setAddedVariables] = useState<
    {
      name: string;
      type: string;
    }[]
  >([]);
  const [selectedVariable, setSelectedVariable] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const stateVariables = useMemo(() => {
    return [...traverseAST(output as any)?.stateVariables];
  }, []);

  const onDragStart = (event: any, nodeType: string, name: string) => {
    event.dataTransfer.setData("node-label", name);
    event.dataTransfer.setData("node-type", nodeType);
  };

  const handleInputChange = (e: any) => {
    setSelectedVariable((prev: any) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleAddVariable = () => {
    setIsOpen(true);
    setAddedVariables((prev) => [
      ...(prev as any),
      {
        name: "newVariable",
        type: EDataType.UINT_256,
      },
    ]);
  };

  const handleTypeClick = (type: any) => {
    setSelectedVariable((prev: any) => ({
      ...prev,
      type,
    }));
    setIsPopoverOpen(false);
  };

  const handleSave = () => {
    setAddedVariables((prev) => {
      const newVars = [...prev];
      //@ts-ignore
      newVars[newVars.length] = selectedVariable;
      console.log(newVars);
      return newVars;
    });
    setIsOpen(false);
    setSelectedVariable(null);
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
          onClick={handleAddVariable}
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
        {stateVariables.map((stateVar, index) => {
          return (
            <ListItem
              _hover={{
                cursor: "grab",
              }}
              _active={{
                cursor: "grabbing",
              }}
              onClick={() => setSelectedVariable(stateVar)}
              _grabbed={{ cursor: "grabbing" }}
              draggable
              onDragStart={(e) =>
                onDragStart(e, ENodeType.VARIABLE_NODE, stateVar.name)
              }
              key={index}
            >
              <Flex justifyContent="space-between" width="full">
                <Text>{stateVar.name}</Text>
                <Text color={getColorOfType(stateVar.type)}>
                  {stateVar.type}
                </Text>
              </Flex>
            </ListItem>
          );
        })}
        {addedVariables.map((stateVar, index) => (
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
              onDragStart(e, ENodeType.VARIABLE_NODE, stateVar.name)
            }
            key={index}
          >
            <Flex justifyContent="space-between" width="full">
              <Text>{stateVar.name}</Text>
              <Text color={getColorOfType(stateVar.type)}>{stateVar.type}</Text>
            </Flex>
          </ListItem>
        ))}
      </List>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent
          backgroundColor="#242736"
          boxShadow="rgb(0 0 0 / 20%) 0px 0px 50px"
          borderRadius="24px"
          containerProps={{
            justifyContent: "flex-end",
            paddingRight: "12px",
          }}
        >
          <ModalCloseButton />
          <ModalHeader>Add a variable</ModalHeader>
          <ModalBody>
            <Flex direction="column">
              <Flex flex={1} mb={4}>
                <Input
                  w="300px"
                  placeholder="Variable name"
                  onChange={handleInputChange}
                  value={selectedVariable?.name}
                />

                <Popover isOpen={isPopoverOpen} placement="bottom-end">
                  <PopoverTrigger>
                    <Button
                      onClick={() => setIsPopoverOpen(true)}
                      ml={2}
                      rightIcon={<FiChevronDown />}
                    >
                      {selectedVariable?.type ?? "Select Type"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    ml={2}
                    maxW={200}
                    bg="#262736 !important"
                    border="none"
                    p={2}
                  >
                    <PopoverBody p={0}>
                      {VariableTypes.map((type, index) => (
                        <Button
                          key={index}
                          w="full"
                          justifyContent="space-between"
                          color="#7b7e8c"
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.05)",
                            color: "#fff",
                          }}
                          bg="transparent"
                          rightIcon={type.icon}
                          onClick={() => handleTypeClick(type.type)}
                        >
                          <Text
                            letterSpacing="0.1em"
                            fontWeight="500"
                            fontSize="10px"
                            style={{ fontFeatureSettings: "'ss02'" }}
                            textTransform="uppercase"
                          >
                            {type.label}
                          </Text>
                        </Button>
                      ))}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
              <Button onClick={handleSave} mb={2}>
                Save
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
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
