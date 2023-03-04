import { DataTypeToLetter } from "@/constants";
import { ENodeType, IDataHandle } from "@/types";
import { getHandleColor } from "@/utils";
import { Flex, Text } from "@chakra-ui/react";
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
  const { id, type, label, outputs } = data;

  const longestOutput = outputs.reduce(
    (acc, output) => (output.label.length > acc ? output.label.length : acc),
    ""
  );

  const outputWidth = longestOutput * 7;

  return (
    <Flex
      minW={`${outputWidth + 75}px`}
      position="relative"
      bg="#262736"
      direction="column"
      borderRadius="12"
      boxShadow={100}
    >
      <Flex direction="row" p="12px">
        <Flex
          justifyContent="flex-start"
          alignItems="flex-end"
          flex={1}
          flexDir="column"
        >
          {outputs.map((output, index) => (
            <Flex
              key={output.id}
              direction="column"
              _notLast={{ marginBottom: "12px" }}
            >
              <Flex>
                <Text
                  lineHeight="16.5px"
                  fontWeight="500"
                  fontSize="9.6px"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  color="#fff"
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
                    color="#fff"
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
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
