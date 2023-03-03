import { DataTypeToLetter } from "@/constants";
import { EDataType, ENodeType, IDataHandle } from "@/types";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Handle, Position } from "reactflow";

interface IVariableNodeProps {
  data: {
    id: string;
    type: ENodeType;
    label: string;
  };
  selected: boolean;
}

const outputs: IDataHandle[] = [
  {
    id: "output",
    type: EDataType.UINT_256,
    label: "Total Number",
  },
];

const calculateHandleTop = (index: number) => {
  return 37 + 25 * index;
};

const calculateHandleDetailsTop = (index: number) => {
  return 46 + 25 * index;
};

const calculateNodeHeight = (numberOfOutputs: number) => {
  return 62 + 18 * numberOfOutputs;
};

export const VariableNode = ({ data, selected }: IVariableNodeProps) => {
  const { id, type, label } = data;
  return (
    <Flex
      minW="260px"
      bg="#262736"
      direction="column"
      borderRadius="12"
      boxShadow={100}
      height={calculateNodeHeight(outputs.length) + "px"}
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
          Variable
        </Text>
      </Flex>
      <Flex direction="row" align="center" p="12px">
        {outputs.map((output, index) => (
          <Flex key={output.id}>
            <Text
              fontWeight="500"
              right="36px"
              top={calculateHandleDetailsTop(index) + "px"}
              position="absolute"
              fontSize="9.6px"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="#7b7e8c"
              style={{
                fontFeatureSettings: "'ss02' on",
              }}
            >
              {output.label}
            </Text>
            <Text
              fontWeight="500"
              right="13.5px"
              top={calculateHandleDetailsTop(index) + "px"}
              position="absolute"
              fontSize="9.6px"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="#7b7e8c"
              style={{
                fontFeatureSettings: "'ss02' on",
              }}
            >
              {DataTypeToLetter[output.type]}
            </Text>
            <Handle
              type="target"
              position={Position.Right}
              id="output"
              style={{
                marginTop: 16,
                marginRight: 14,
                height: 16,
                width: 16,
                borderRadius: 4,
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                top: calculateHandleTop(index) + "px",
              }}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
