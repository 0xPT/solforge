import { VariableNode } from "@/components/nodes/Variable";
import { FunctionNode } from "@/components/nodes/Function";
import { OperationNode } from "@/components/nodes/Operation";
import { ExpressionNode } from "@/components/nodes/Expression";
import { ComparisonNode } from "@/components/nodes/Comparison";
import { RequireNode } from "@/components/nodes/Require";
import { EDataType, ENodeType } from "@/types";
import { MemberAccessNode } from "./components/nodes/MemberAccess";
import { IndexAccessNode } from "./components/nodes/IndexAccess";

export const NodeElements = {
  [ENodeType.VARIABLE_NODE]: VariableNode,
  [ENodeType.FUNCTION_NODE]: FunctionNode,
  [ENodeType.OPERATION_NODE]: OperationNode,
  [ENodeType.EXPRESSION_NODE]: ExpressionNode,
  [ENodeType.COMPARISON_NODE]: ComparisonNode,
  [ENodeType.REQUIRE_NODE]: RequireNode,
  [ENodeType.MEMBER_ACCESS_NODE]: MemberAccessNode,
  [ENodeType.INDEX_ACCESS_NODE]: IndexAccessNode,
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
