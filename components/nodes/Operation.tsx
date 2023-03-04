import { DataTypeToLetter } from "@/constants";
import { EDataType, ENodeType, EOperationType, IDataHandle } from "@/types";
import { getHandleColor } from "@/utils";
import { Checkbox, Flex, Input, Text } from "@chakra-ui/react";
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
          color="#fff"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
            fontSize: "20px",
          }}
        />
      );
    case EOperationType.SUBTRACTION:
      return (
        <FiMinus
          color="#fff"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
            fontSize: "20px",
          }}
        />
      );
    case EOperationType.MULTIPLICATION:
      return (
        <FiX
          color="#fff"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
            fontSize: "20px",
          }}
        />
      );
    case EOperationType.DIVISION:
      return (
        <FiSlash
          color="#fff"
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "1.5px",
            fontSize: "20px",
          }}
        />
      );
    default:
      return <></>;
  }
};

export const OperationNode = ({ data, selected }: IOperationNodeProps) => {
  const { id, type, label, operation, inputs, outputs, updateNode } = data;

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    checkbox?: boolean
  ) => {
    updateNode({
      ...data,
      inputs: inputs.map((input, i) => {
        if (i === index) {
          return {
            ...input,
            value: checkbox ? e.target.checked : e.target.value,
          };
        }
        return input;
      }),
    });
  };

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
              {input.type === EDataType.BOOLEAN_LITERAL ||
              input.type === EDataType.NUMBER_LITERAL ? (
                <>
                  {input.type === EDataType.BOOLEAN_LITERAL ? (
                    <Checkbox
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onInputChange(e, index, true)
                      }
                      isChecked={input.value}
                    />
                  ) : (
                    <Input
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onInputChange(e, index, false)
                      }
                      value={input.value}
                      style={{
                        display: "flex",
                        position: "relative",
                        height: 16,
                        fontSize: "9.6px",
                        minWidth: 16,
                        borderRadius: 4,
                        color: "white",
                        border: "1px solid white",
                        borderColor: getHandleColor(input.type),
                      }}
                      paddingLeft="4px"
                      paddingRight="4px"
                      width="50px"
                    />
                  )}
                </>
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
          bottom="14px"
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
