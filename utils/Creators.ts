import { Expression, ExpressionOrRight, SubNodesEntity } from "@/AstTypes";
import { EDataType, ENodeType, Operators } from "@/types";
import { getEdgeColor } from "@/utils";
import { Node } from "reactflow";

export const createEdge = ({
  source,
  sourceHandle,
  target,
  targetHandle,
  id,
  type,
}: any) => {
  return {
    source,
    sourceHandle,
    target,
    targetHandle,
    id,
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.EXECUTE) },
  };
};

export const createSetterNode = (expression: Expression) => {
  // The input of a setter node should be the result of right side of the expression.
  // The output of a setter node should be an execution line. And anywhere that the set variable is used.
  const setterId = createNodeId({ type: ENodeType.EXPRESSION_NODE });
  const setterNode: Node = {
    id: setterId,
    data: {
      label: "Set",
      type: ENodeType.EXPRESSION_NODE,
      inputs: [],
      outputs: [],
    },
    position: { x: 0, y: 0 },
  };
  return setterNode;
};

export const createOperatorNode = (expression: Expression) => {
  const operatorNodeId = createNodeId({
    type: ENodeType.OPERATION_NODE,
    data: { operator: expression.operator as Operators },
  });
  const operatorNode: Node = {
    id: operatorNodeId,
    data: {
      label: expression.operator,
      type: ENodeType.OPERATION_NODE,
      inputs: [],
      outputs: [],
    },
    position: { x: 0, y: 0 },
  };
  return operatorNode;
};

export const createVariableNode = (variable: ExpressionOrRight) => {
  const variableNodeId = createNodeId({
    type: ENodeType.VARIABLE_NODE,
    data: { variableName: variable?.name ?? "" },
  });
  const variableNode: Node = {
    id: variableNodeId,
    data: {
      label: variable?.name,
      type: variable?.type,
      inputs: [],
      outputs: [],
    },
    position: { x: 0, y: 0 },
  };
  return variableNode;
};

export const createFunctionDeclarationAndReturnNodes = (
  subNode: SubNodesEntity
) => {
  const functionDeclarationNode: Node = {
    id: "function-start",
    data: {
      label: "Function Start",
      type: ENodeType.FUNCTION_NODE,
      inputs: [], // Function declarations have no inputs, just outputs.
      outputs: subNode.parameters?.map((param: any) => ({
        id: param?.name,
        type: param?.typeName?.name,
        label: param?.name,
      })),
    },
    position: { x: 0, y: 0 },
  };

  const functionReturnNode: Node = {
    id: "function-end",
    data: {
      label: "Function End",
      type: ENodeType.FUNCTION_NODE,
      inputs: subNode?.returnParameters?.map((param: any) => ({
        id: param?.name,
        type: param?.typeName?.name,
        label: param?.name,
      })),
      outputs: [],
    },
    position: { x: 0, y: 0 },
  };
  return [functionDeclarationNode, functionReturnNode];
};

// Creates the top level node id for function declarations and returns, expressions, and variables.
export const createNodeId = ({
  type,
  data,
}: {
  type: ENodeType;
  data?: {
    isFunctionStart?: boolean;
    expressionType?: "set" | "operator";
    variableName?: string;
    operator?: Operators;
  };
}): string => {
  const uuid = Math.random().toString(36).substring(2, 15);
  switch (type) {
    case ENodeType.FUNCTION_NODE: {
      if (data?.isFunctionStart) return "function-start";
      else return "function-end";
    }
    case ENodeType.EXPRESSION_NODE: {
      return `expression/set/${uuid}`;
    }
    case ENodeType.VARIABLE_NODE: {
      return `variable/${data?.variableName}/${uuid}`;
    }
    case ENodeType.OPERATION_NODE: {
      return `expression/operation/${data?.operator}/${uuid}`;
    }
  }
};
