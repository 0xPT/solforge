import { DataTypeToLetter } from "@/constants";
import {
  EComparisonType,
  EDataType,
  ENodeType,
  EOperationType,
  IDataHandle,
} from "@/types";
import { getHandleColor } from "@/utils";
import { Checkbox, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Handle, Position } from "reactflow";

interface IComparisonNodeProps {
  data: {
    id: string;
    type: ENodeType;
    label: string;
    operation: EOperationType;
  };
  selected: boolean;
}

const OperationIcon = ({ operation }: { operation: EComparisonType }) => {
  switch (operation) {
    case EComparisonType.LESS_THAN:
      return (
        <FiArrowLeft
          color="#7b7e8c"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
          }}
          size={12}
        />
      );
    case EComparisonType.GREATER_THAN:
      return (
        <FiArrowRight
          color="#7b7e8c"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
          }}
          size={12}
        />
      );
    case EComparisonType.DOUBLE_EQUALS:
      return (
        <Flex
          color="#fff"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
            fontWeight: 200,
            fontSize: 30,
          }}
        >
          =
        </Flex>
      );
    default:
      return <></>;
  }
};

export const ComparisonNode = ({ data, selected }: IComparisonNodeProps) => {
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
      <Flex direction="row" p="12px">
        <Flex direction="column">
          {inputs.map((input, index) => (
            <Flex
              key={input.id}
              direction="column"
              _notLast={{ marginBottom: "12px" }}
            >
              {input.type === EDataType.BOOLEAN_LITERAL ? (
                <Checkbox value={input.value} />
              ) : (
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
                    color="#7b7e8c"
                    style={{
                      fontFeatureSettings: "'ss02' on",
                    }}
                    ml="5px"
                  >
                    {input.label}
                  </Text>
                </Flex>
              )}
            </Flex>
          ))}
        </Flex>
        <Flex
          position="absolute"
          w="full"
          justifyContent="center"
          left="0px"
          bottom="6px"
        >
          <OperationIcon operation={operation} />
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
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
