import { VariableNode } from "@/components/nodes/Variable";
import { FunctionNode } from "@/components/nodes/Function";
import { OperationNode } from "@/components/nodes/Operation";
import { ExpressionNode } from "@/components/nodes/Expression";
import { EDataType, ENodeType } from "@/types";

export const NodeElements = {
  [ENodeType.VARIABLE_NODE]: VariableNode,
  [ENodeType.FUNCTION_NODE]: FunctionNode,
  [ENodeType.OPERATION_NODE]: OperationNode,
  [ENodeType.EXPRESSION_NODE]: ExpressionNode,
};

export const DataTypeToLetter = {
  [EDataType.EXECUTE]: "E",
  [EDataType.BOOL]: "B",
  [EDataType.INT_256]: "I",
  [EDataType.UINT_256]: "U",
  [EDataType.STRING]: "S",
  [EDataType.ADDRESS]: "A",
  [EDataType.MAPPING]: "M",
  [EDataType.STRUCT]: "T",
  [EDataType.ARRAY]: "R",
};
