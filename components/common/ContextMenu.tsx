import { useClickOutside } from "@/hooks/useClickOutside";
import { Menu, MenuList, Box, Text, Flex } from "@chakra-ui/react";
import React, { useRef } from "react";
import { EFunctionType, ENodeType, EOperationType } from "@/types";

interface ContextMenuProps {
  pos: {
    top: number;
    left: number;
  };
  isOpen: boolean;
  handleContextMenuClose: () => void;
  onAddNode: (
    node: ENodeType,
    additional?: EOperationType | EFunctionType
  ) => void;
}

interface ISuboption {
  label: string;
  nodeType: ENodeType;
  additional?: EOperationType | EFunctionType;
}

interface IOption {
  label: string;
  suboptions?: ISuboption[];
}

const Options: IOption[] = [
  {
    label: "Variables",
    suboptions: [
      {
        label: "Variable",
        nodeType: ENodeType.VARIABLE_NODE,
      },
    ],
  },
  {
    label: "Functions",
    suboptions: [
      {
        label: "Function Start",
        nodeType: ENodeType.FUNCTION_NODE,
        additional: EFunctionType.START,
      },
      {
        label: "Function End",
        nodeType: ENodeType.FUNCTION_NODE,
        additional: EFunctionType.END,
      },
    ],
  },
  {
    label: "Operations",
    suboptions: [
      {
        label: "Addition",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.ADDITION,
      },
      {
        label: "Subtraction",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.SUBTRACTION,
      },
      {
        label: "Multiplication",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.MULTIPLICATION,
      },
      {
        label: "Division",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.DIVISION,
      },
    ],
  },
];

export const ContextMenu = ({
  pos,
  isOpen,
  handleContextMenuClose,
  onAddNode,
}: ContextMenuProps) => {
  const contextMenuRef = useRef(null);
  useClickOutside(contextMenuRef, handleContextMenuClose);

  const selectOption = (
    nodeType: ENodeType,
    additional?: EOperationType | EFunctionType
  ) => {
    onAddNode(nodeType, additional);

    handleContextMenuClose();
  };

  return (
    <Box ref={contextMenuRef} pos="absolute" top={pos.top} left={pos.left}>
      <Menu isOpen={isOpen} onClose={handleContextMenuClose}>
        <MenuList
          bg="#262736"
          border="none"
          boxShadow="0 0 20px rgba(0, 0, 0, 0.33)"
          borderRadius="12px"
          w="400px"
        >
          {Options.map((option) => (
            <Flex
              key={option.label}
              direction="column"
              bg="#262736"
              p={0}
              marginTop="16px"
              _first={{ marginTop: "8px" }}
              _last={{ marginBottom: "8px" }}
            >
              <Flex w="full" py={1} px={4}>
                <Text
                  color="#7b7e8c"
                  letterSpacing="0.1em"
                  fontWeight="500"
                  fontSize="12px"
                  style={{ fontFeatureSettings: "'ss02'" }}
                  textTransform="uppercase"
                >
                  {option.label}
                </Text>
              </Flex>
              {option.suboptions && (
                <Flex px="18px" direction="column" mt="4px">
                  {option.suboptions?.map((suboption) => (
                    <Flex
                      key={suboption.label}
                      w="full"
                      py={1}
                      px={4}
                      onClick={() =>
                        selectOption(suboption.nodeType, suboption.additional)
                      }
                    >
                      <Text
                        color="#fff"
                        letterSpacing="0.1em"
                        fontWeight="500"
                        fontSize="12px"
                        textTransform="uppercase"
                      >
                        {suboption.label}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
