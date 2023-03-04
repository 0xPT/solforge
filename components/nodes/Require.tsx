import { DataTypeToLetter } from "@/constants";
import {
  EComparisonType,
  EDataType,
  ENodeType,
  EOperationType,
  IDataHandle,
} from "@/types";
import { getHandleColor } from "@/utils";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Handle, Position } from "reactflow";

interface IRequireNodeProps {
  data: {
    id: string;
    type: ENodeType;
    label: string;
  };
  selected: boolean;
}

export const RequireNode = ({ data, selected }: IRequireNodeProps) => {
  const { id, type, label, operation, inputs, outputs } = data;
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
          color="#fff"
        >
          Require
        </Text>
      </Flex>
      <Flex direction="row" p="12px">
        <Flex direction="column">
          {inputs.map((input, index) => (
            <Flex
              key={input.id}
              direction="column"
              _notLast={{ marginBottom: "12px" }}
            >
              <Flex>
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
                  {input.type === EDataType.EXECUTE && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 2.3,
                        width: 0,
                        height: 0,
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderLeft: "8px solid #fff",
                        transform: "translateX(8px)",
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px",
                      }}
                    ></div>
                  )}
                  <Text
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
                  color="#fff"
                  style={{
                    fontFeatureSettings: "'ss02' on",
                  }}
                  ml="5px"
                >
                  {input.label}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Flex
          justifyContent="flex-start"
          alignItems="flex-end"
          flex={1}
          flexDir="column"
        >
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
                position={Position.Right}
                id={output.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  right: output.type === EDataType.EXECUTE ? 0 : -2,
                  height: 16,
                  width: 16,
                  borderRadius: 4,
                  border: "none",
                  backgroundColor: getHandleColor(output.type),
                }}
              >
                {output.type === EDataType.EXECUTE && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 2.3,
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderLeft: "8px solid #fff",
                      transform: "translateX(8px)",
                      borderTopLeftRadius: "4px",
                      borderBottomLeftRadius: "4px",
                    }}
                  ></div>
                )}
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
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
