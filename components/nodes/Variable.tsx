import { NodeTypes } from "@/types";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { Handle, Position } from "reactflow";

interface VariableNodeProps {
  data: {
    id: string;
    type: NodeTypes;
    label: string;
  };
  selected: boolean;
}

export const VariableNode = ({ data, selected }: VariableNodeProps) => {
  return (
    <Flex minW={40} bg="gray.800" direction="column" borderRadius="5">
      <Handle type="target" position={Position.Right} id="output" />
      <Flex direction="row" align="center" p={4}>
        <Editable defaultValue={data.label}>
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
    </Flex>
  );
};
