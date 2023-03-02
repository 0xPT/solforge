import { NodeTypes } from "@/types";
import {
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineFunction } from "react-icons/ai";
import { HiVariable } from "react-icons/hi";
import { Handle, Position } from "reactflow";

interface FunctionNodeTypeProps {
  data: {
    id: string;
    type: NodeTypes;
    label: string;
    inputs: {
      name: string;
      type: string;
    }[];
    outputs: {
      name: string;
      type: string;
    };
  };
  selected: boolean;
}

export const FunctionNode = ({ data, selected }: FunctionNodeTypeProps) => {
  return (
    <Flex bg="purple.700" minW={40} direction="column" borderRadius="5">
      <Flex p={2}>
        <AiOutlineFunction />
        <Text>{data.label}</Text>
      </Flex>
      <Divider />
      <Flex justify="flex-end" minH={12}>
        {data.inputs?.map((input) => (
          <Flex key={input.name}>
            <Text ml="auto">{input.name}</Text>
            <Handle
              style={{ marginTop: 12 }}
              type="source"
              position={Position.Right}
              id="input"
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
