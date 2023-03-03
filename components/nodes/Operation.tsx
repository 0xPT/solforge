import { DataTypeToLetter } from "@/constants";
import { EDataType, ENodeType, EOperationType, IDataHandle } from "@/types";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FiMinus, FiPlus, FiSlash, FiX } from "react-icons/fi";
import { Handle, Position } from "reactflow";

interface IOperationNodeProps {
  data: {
    id: string;
    type: ENodeType;
    label: string;
    operation: EOperationType;
  };
  selected: boolean;
}

const OperationIcon = ({ operation }: { operation: EOperationType }) => {
  switch (operation) {
    case EOperationType.ADDITION:
      return (
        <FiPlus
          color="#7b7e8c"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
          }}
          size={12}
        />
      );
    case EOperationType.SUBTRACTION:
      return (
        <FiMinus
          color="#7b7e8c"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
          }}
          size={12}
        />
      );
    case EOperationType.MULTIPLICATION:
      return (
        <FiX
          color="#7b7e8c"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
          }}
          size={12}
        />
      );
    case EOperationType.DIVISION:
      return (
        <FiSlash
          color="#7b7e8c"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
          }}
          size={12}
        />
      );
    default:
      return <></>;
  }
};

const inputs: IDataHandle[] = [
  {
    id: "first-number",
    type: EDataType.UINT_256,
    label: "First Number",
  },
  {
    id: "second-number",
    type: EDataType.UINT_256,
    label: "Second Number",
  },
];

const outputs = [
  {
    id: "output",
    type: EDataType.UINT_256,
    label: "Output",
  },
];

export const OperationNode = ({ data, selected }: IOperationNodeProps) => {
  const { id, type, label, operation } = data;
  return (
    <Flex
      position="relative"
      minW="260px"
      bg="#262736"
      direction="column"
      borderRadius="12"
      boxShadow={100}
    >
      <Flex
        borderBottomWidth={2}
        borderColor="#34384e"
        padding="14px 12px 12px"
      >
        <Text
          style={{
            fontFeatureSettings: "'ss02' on",
          }}
          fontSize="9.6px"
          fontWeight="500"
          textTransform="uppercase"
          lineHeight={0.6}
          letterSpacing="0.1em"
          color="#7b7e8c"
        >
          {operation}
        </Text>
      </Flex>
      <Flex direction="row" p="12px">
        <Flex direction="column">
          {inputs.map((input, index) => (
            <Flex key={input.id} direction="column">
              <Flex>
                <Handle
                  type="source"
                  position={Position.Left}
                  id={input.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    height: 16,
                    width: 16,
                    borderRadius: 4,
                    border: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Text
                    fontWeight="500"
                    fontSize="9.6px"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    color="#7b7e8c"
                    mt="1.5px"
                    ml="0.75px"
                    style={{
                      fontFeatureSettings: "'ss02' on",
                    }}
                  >
                    {DataTypeToLetter[input.type]}
                  </Text>
                </Handle>
                <Text
                  pointerEvents="none"
                  lineHeight="16.5px"
                  fontWeight="500"
                  fontSize="9.6px"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  color="#7b7e8c"
                  style={{
                    fontFeatureSettings: "'ss02' on",
                  }}
                  ml="5px"
                >
                  {input.label}
                </Text>
              </Flex>
              {index !== inputs.length - 1 && (
                <OperationIcon operation={operation} />
              )}
            </Flex>
          ))}
        </Flex>
        <Flex justifyContent="flex-end" flex={1}>
          {outputs.map((output, index) => (
            <Flex key={output.id}>
              <Text
                lineHeight="16.5px"
                fontWeight="500"
                fontSize="9.6px"
                textTransform="uppercase"
                letterSpacing="0.1em"
                color="#7b7e8c"
                style={{
                  fontFeatureSettings: "'ss02' on",
                }}
                mr="5px"
              >
                {output.label}
              </Text>
              <Handle
                type="source"
                position={Position.Left}
                id={output.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  height: 16,
                  width: 16,
                  borderRadius: 4,
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Text
                  pointerEvents="none"
                  fontWeight="500"
                  fontSize="9.6px"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  color="#7b7e8c"
                  mt="1.5px"
                  ml="0.75px"
                  style={{
                    fontFeatureSettings: "'ss02' on",
                  }}
                >
                  {DataTypeToLetter[output.type]}
                </Text>
              </Handle>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
