import { DataTypeToLetter } from "@/constants";
import {
  EDataType,
  EFunctionType,
  ENodeType,
  EOperationType,
  IDataHandle,
} from "@/types";
import { getHandleColor } from "@/utils";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Handle, Position } from "reactflow";

interface IFunctionNodeProps {
  data: {
    id: string;
    label: string;
    type: EDataType;
    operation: EFunctionType;
  };
  selected: boolean;
}

const inputs = [
  {
    id: "execute",
    type: EDataType.EXECUTE,
    label: "Execute",
  },
  {
    id: "output",
    type: EDataType.UINT_256,
    label: "Output",
  },
];

const outputs = [
  {
    id: "execute",
    type: EDataType.EXECUTE,
    label: "Execute",
  },
  {
    id: "output",
    type: EDataType.UINT_256,
    label: "Output",
  },
];

export const FunctionNode = ({ data, selected }: IFunctionNodeProps) => {
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
          {label}
        </Text>
      </Flex>
      <Flex direction="row" p="12px">
        {operation === EFunctionType.END && (
          <Flex direction="column">
            {inputs.map((input, index) => (
              <Flex key={input.id} _notLast={{ marginBottom: "12px" }}>
                <Handle
                  type="target"
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
                    backgroundColor: getHandleColor(input.type),
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
                    {DataTypeToLetter[input.type]}
                  </Text>
                </Handle>
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
                  ml="5px"
                >
                  {input.label}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
        {operation === EFunctionType.START && (
          <Flex alignItems="flex-end" flex={1} direction="column">
            {outputs.map((output, index) => (
              <Flex key={output.id} _notLast={{ marginBottom: "12px" }}>
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
                  position={Position.Right}
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
                    backgroundColor: getHandleColor(output.type),
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
        )}
      </Flex>
    </Flex>
  );
};
