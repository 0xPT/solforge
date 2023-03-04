import { useClickOutside } from "@/hooks/useClickOutside";
import {
  Menu,
  MenuList,
  Box,
  Button,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Popover,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { EDataType, EFunctionType, ENodeType, EOperationType } from "@/types";
import {
  FiChevronRight,
  FiDivide,
  FiMinus,
  FiPlus,
  FiSlash,
} from "react-icons/fi";
import { AiOutlineFunction } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import { VscDebugStepInto } from "react-icons/vsc";
import { HiVariable } from "react-icons/hi";
import { VariableIcon } from "./VariableIcon";

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
  variableType?: EDataType;
  icon?: React.ReactElement;
}

interface IOption {
  label: string;
  suboptions?: ISuboption[];
  icon: React.ReactElement;
  actionType?: "showMenu" | "addNode";
  nodeType?: ENodeType;
  additional?: EOperationType | EFunctionType;
}

const Options: IOption[] = [
  {
    label: "Add a Variable",
    icon: <HiVariable />,
    suboptions: [
      {
        label: "Array",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.ARRAY} />,
      },
      {
        label: "Boolean",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.BOOL} />,
      },
      {
        label: "Address",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.ADDRESS} />,
      },
      {
        label: "Uint_256",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.UINT_256} />,
      },
      {
        label: "Int_256",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.INT_256} />,
      },
      {
        label: "Map",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.MAPPING} />,
      },
      {
        label: "String",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.STRING} />,
      },
      {
        label: "Struct",
        nodeType: ENodeType.VARIABLE_NODE,
        icon: <VariableIcon type={EDataType.STRUCT} />,
      },
    ],
  },
  {
    label: "Set a variable",
    icon: <VscDebugStepInto />,
    actionType: "addNode",
    nodeType: ENodeType.EXPRESSION_NODE,
  },
  {
    label: "Add a Function",
    icon: <AiOutlineFunction />,
    suboptions: [
      {
        label: "Function Start",
        nodeType: ENodeType.FUNCTION_NODE,
        additional: EFunctionType.START,
        icon: <AiOutlineFunction />,
      },
      {
        label: "Function End",
        nodeType: ENodeType.FUNCTION_NODE,
        additional: EFunctionType.END,
        icon: <AiOutlineFunction />,
      },
    ],
  },
  {
    label: "Math Operations",
    icon: <FiDivide />,
    suboptions: [
      {
        label: "Addition",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.ADDITION,
        icon: <FiPlus />,
      },
      {
        label: "Subtraction",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.SUBTRACTION,
        icon: <FiMinus />,
      },
      {
        label: "Multiplication",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.MULTIPLICATION,
        icon: <FiX />,
      },
      {
        label: "Division",
        nodeType: ENodeType.OPERATION_NODE,
        additional: EOperationType.DIVISION,
        icon: <FiSlash />,
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

  const [selectedParentOption, setSelectedParentOption] =
    React.useState<IOption | null>(null);

  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
  } = useDisclosure();

  const selectOption = ({
    nodeType,
    additional,
  }: {
    nodeType: ENodeType;
    additional?: EOperationType | EFunctionType;
  }) => {
    onAddNode(nodeType, additional);
    handleContextMenuClose();
  };

  const handleChildMenuClick = (opt: ISuboption) => {
    selectOption({
      nodeType: opt.nodeType as ENodeType,
      additional: opt.additional,
    });
    onPopoverClose();
  };

  const handleParentMenuClick = (e: any, option: IOption) => {
    if (option.actionType !== "addNode") {
      setSelectedParentOption(option);
    } else {
      e.preventDefault();
      e.stopPropagation();
      selectOption({
        nodeType: option.nodeType as ENodeType,
        additional: option.additional,
      });
    }
  };

  return (
    <Box ref={contextMenuRef} pos="absolute" top={pos.top} left={pos.left}>
      <Popover
        isOpen={isPopoverOpen}
        onOpen={onPopoverOpen}
        onClose={onPopoverClose}
        placement="right-end"
        flip={false}
      >
        <PopoverContent
          ml={2}
          maxW={200}
          bg="#262736 !important"
          border="none"
          p={2}
        >
          <PopoverBody p={0}>
            {selectedParentOption?.suboptions?.map((suboption) => (
              <Button
                key={suboption.label}
                w="full"
                justifyContent="space-between"
                color="#7b7e8c"
                _hover={{ bg: "rgba(255, 255, 255, 0.05)", color: "#fff" }}
                bg="transparent"
                rightIcon={suboption.icon}
                className="ignore-click-outside" // hack to fix issue with click outside
                onClick={() => handleChildMenuClick(suboption)}
              >
                <Text
                  className="ignore-click-outside"
                  letterSpacing="0.1em"
                  fontWeight="500"
                  fontSize="10px"
                  style={{ fontFeatureSettings: "'ss02'" }}
                  textTransform="uppercase"
                >
                  {suboption.label}
                </Text>
              </Button>
            ))}
          </PopoverBody>
        </PopoverContent>
        <Menu isOpen={isOpen} onClose={handleContextMenuClose}>
          <MenuList
            display="flex"
            flexDirection="column"
            bg="#262736"
            border="none"
            boxShadow="0 0 20px rgba(0, 0, 0, 0.33)"
            borderRadius="12px"
            p={2}
          >
            {Options.map((option) => (
              <PopoverTrigger key={option.label}>
                <Button
                  color="#7b7e8c"
                  _hover={{
                    color: "#FFF",
                    bg: "rgba(255, 255, 255, 0.05)",
                  }}
                  bg="transparent"
                  justifyContent="space-between"
                  className="ignore-click-outside"
                  onClick={(e) => handleParentMenuClick(e, option)}
                  leftIcon={option.icon}
                  rightIcon={
                    option.actionType === "addNode" ? (
                      <FiPlus />
                    ) : (
                      <FiChevronRight />
                    )
                  }
                >
                  <Text
                    className="ignore-click-outside"
                    letterSpacing="0.1em"
                    fontWeight="500"
                    fontSize="10px"
                    style={{ fontFeatureSettings: "'ss02'" }}
                    textTransform="uppercase"
                  >
                    {option.label}
                  </Text>
                </Button>
              </PopoverTrigger>
            ))}
          </MenuList>
        </Menu>
      </Popover>
    </Box>
  );
};
