import { ENodeType, EDataType, EComparisonType, EOperationType } from "@/types";
import { getEdgeColor } from "@/utils";

interface Variable {
  type: string;
  name: string;
  parameter: boolean;
}
interface VariableObject {
  [key: string]: Variable;
}

export const isLiteral = (type: string) => {
  return (
    type === "BooleanLiteral" ||
    type === "StringLiteral" ||
    type === "NumberLiteral"
  );
};

export const variableToDataType = (variable: Variable) => {
  switch (variable.type) {
    case "uint256":
      return EDataType.UINT_256;
    case "string":
      return EDataType.STRING;
    case "address":
      return EDataType.ADDRESS;
    case "bool":
      return EDataType.BOOL;
  }
};

export const comparisonToNodeType = (comparison: string) => {
  switch (comparison) {
    case "<":
      return EComparisonType.LESS_THAN;
    case ">":
      return EComparisonType.GREATER_THAN;
    case "==":
      return EComparisonType.DOUBLE_EQUALS;
  }
};

export const operatorToNodeType = (operator: string) => {
  switch (operator) {
    case "+":
      return EOperationType.ADDITION;
    case "-":
      return EOperationType.SUBTRACTION;
  }
};

export const createSetterNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const setterId = Math.random().toString(36).substr(2, 15);

  const rightNode = isLiteral(astNode.right.type)
    ? {
        type: astNode.right.type,
      }
    : traverse(
        astNode.right,
        {
          x: position.x - 350,
          y: position.y + 200,
        },
        functionInfo
      );

  const setterNode = {
    id: setterId,
    type: ENodeType.EXPRESSION_NODE,
    data: {
      label: `Set ${astNode.left.name}`,
      type: ENodeType.EXPRESSION_NODE,
      inputs: [
        {
          id: "execute",
          type: EDataType.EXECUTE,
          label: "",
        },
        {
          id: "right",
          type: rightNode.type,
          label: "",
        },
      ],
      outputs: [
        {
          id: "execute",
          type: EDataType.EXECUTE,
          label: "",
        },
      ],
    },
    position,
  };

  nodes.push(setterNode);
  // edges.push({
  //   source: leftNode?.nodeId,
  //   sourceHandle: "output",
  //   target: setterId,
  //   targetHandle: "left",
  //   id: `${leftNode?.nodeId}-${setterId}-left`,
  //   type: "bezier",
  //   style: { stroke: getEdgeColor(EDataType.EXECUTE) },
  // });

  if (!isLiteral(astNode.right.type)) {
    edges.push({
      source: rightNode?.nodeId,
      sourceHandle: "output",
      target: setterId,
      targetHandle: `right`,
      id: `${rightNode?.nodeId}-${setterId}-right`,
      type: "bezier",
      style: { stroke: getEdgeColor(rightNode.type) },
    });
  }

  return {
    nodeId: setterId,
    handleId: "execute",
    type: EDataType.EXECUTE,
    label: astNode.operator,
  };
};

export const createComparisonNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const comparisonNodeId = Math.random().toString(36).substr(2, 15);

  const leftNode = traverse(
    astNode.left,
    {
      x: position.x - 200,
      y: position.y,
    },
    functionInfo
  );

  const rightNode =
    astNode.right.type === "BooleanLiteral"
      ? {
          type: EDataType.BOOLEAN_LITERAL,
        }
      : traverse(
          astNode.right,
          {
            x: position.x - 500,
            y: position.y + 250,
          },
          functionInfo
        );

  const comparisonNode = {
    id: comparisonNodeId,
    type: ENodeType.COMPARISON_NODE,
    data: {
      label: astNode.operator,
      type: ENodeType.COMPARISON_NODE,
      operation: comparisonToNodeType(astNode.operator),
      inputs: [
        {
          id: "left",
          type: leftNode.type,
          label: "",
        },
        {
          id: "right",
          type: rightNode.type,
          label: "",
          value: astNode.right.value ?? null,
        },
      ],
      outputs: [
        {
          id: "output",
          type: EDataType.BOOL,
          label: "",
        },
      ],
    },
    position,
  };

  nodes.push(comparisonNode);
  edges.push({
    source: leftNode.isParameter
      ? functionInfo.functionStartId
      : leftNode?.nodeId,
    sourceHandle: leftNode.isParameter ? leftNode.label : "output",
    target: comparisonNodeId,
    targetHandle: "left",
    id: `${leftNode?.nodeId}-${comparisonNodeId}-left`,
    type: "bezier",
    style: { stroke: getEdgeColor(leftNode.type) },
  });

  if (rightNode.type !== EDataType.BOOLEAN_LITERAL) {
    edges.push({
      source: rightNode.isParameter
        ? functionInfo.functionStartId
        : rightNode?.nodeId,
      sourceHandle: rightNode.isParameter ? rightNode.label : "output",
      target: comparisonNodeId,
      targetHandle: `right`,
      id: `${rightNode?.nodeId}-${comparisonNodeId}-right`,
      type: "bezier",
      style: { stroke: getEdgeColor(rightNode.type) },
    });
  }
  return {
    nodeId: comparisonNodeId,
    handleId: "output",
    type: leftNode.type,
    label: astNode.operator,
  };
};

export const createOperatorNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const operatorNodeId = Math.random().toString(36).substr(2, 15);

  const leftNode = traverse(
    astNode.left,
    {
      x: position.x - 200,
      y: position.y,
    },
    functionInfo
  );

  const rightNode = isLiteral(astNode.right.type)
    ? {
        type: astNode.right.type,
      }
    : traverse(
        astNode.right,
        {
          x: position.x - 200,
          y: position.y + 250,
        },
        functionInfo
      );

  const operatorNode = {
    id: operatorNodeId,
    type: ENodeType.OPERATION_NODE,
    data: {
      label: astNode.operator,
      type: ENodeType.OPERATION_NODE,
      operation: operatorToNodeType(astNode.operator),
      inputs: [
        {
          id: "left",
          type: leftNode.type,
          label: "",
        },
        {
          id: "right",
          type: rightNode.type,
          value: astNode.right.value ?? null,
          label: "",
        },
      ],
      outputs: [
        {
          id: "output",
          type: leftNode.type,
          label: "",
        },
      ],
    },
    position,
  };

  nodes.push(operatorNode);
  edges.push({
    source: leftNode.isParameter
      ? functionInfo.functionStartId
      : leftNode?.nodeId,
    sourceHandle: leftNode.isParameter ? leftNode.label : "output",
    target: operatorNodeId,
    targetHandle: "left",
    id: `${leftNode?.nodeId}-${operatorNodeId}-left`,
    type: "bezier",
    style: { stroke: getEdgeColor(leftNode.type) },
  });
  if (!isLiteral(rightNode.type)) {
    edges.push({
      source: rightNode.isParameter
        ? functionInfo.functionStartId
        : rightNode?.nodeId,
      sourceHandle: rightNode.isParameter ? rightNode.label : "output",
      target: operatorNodeId,
      targetHandle: `right`,
      id: `${rightNode?.nodeId}-${operatorNodeId}-right`,
      type: "bezier",
      style: { stroke: getEdgeColor(rightNode.type) },
    });
  }
  return {
    nodeId: operatorNodeId,
    handleId: "output",
    type: leftNode.type,
    label: astNode.operator,
  };
};

export const createBooleanLiteralNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const booleanNodeId = Math.random().toString(36).substr(2, 15);
  const booleanNode = {
    id: booleanNodeId,
    type: ENodeType.VARIABLE_NODE,
    data: {
      label: astNode.value,
      type: ENodeType.VARIABLE_NODE,
      inputs: [],
      outputs: [
        {
          id: `output`,
          type: EDataType.BOOL,
          label: astNode.value,
        },
      ],
    },
    position,
  };
  nodes.push(booleanNode);

  return {
    nodeId: booleanNodeId,
    handleId: "output",
    type: EDataType.BOOL,
    label: astNode.value,
  };
};

export const createMemberAccessNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const memberAccessNodeId = Math.random().toString(36).substr(2, 15);

  const leftNode = traverse(
    astNode.expression,
    {
      x: position.x - 500,
      y: position.y,
    },
    functionInfo
  );

  const memberAccessNode = {
    id: memberAccessNodeId,
    type: ENodeType.MEMBER_ACCESS_NODE,
    data: {
      label: astNode.operator,
      type: ENodeType.MEMBER_ACCESS_NODE,
      inputs: [
        {
          id: "left",
          type: leftNode.type,
          label: "",
        },
      ],
      outputs: [
        {
          id: "output",
          type: EDataType.ANY,
          label: "",
        },
      ],
    },
    position,
  };

  nodes.push(memberAccessNode);
  edges.push({
    source: leftNode.isParameter
      ? functionInfo.functionStartId
      : leftNode?.nodeId,
    sourceHandle: leftNode.isParameter ? leftNode.label : "output",

    target: memberAccessNodeId,

    targetHandle: "left",
    id: `${leftNode?.nodeId}-${memberAccessNodeId}-left`,
    type: "bezier",
    style: { stroke: getEdgeColor(leftNode.type) },
  });
  return {
    nodeId: memberAccessNodeId,
    handleId: "output",
    type: EDataType.ANY,
    label: astNode.operator,
  };
};

export const createIndexAccessNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const indexAccessNodeId = Math.random().toString(36).substr(2, 15);

  const rightNode = traverse(
    astNode.index,
    {
      x: position.x - 500,
      y: position.y + 250,
    },
    functionInfo
  );

  const indexAccessNode = {
    id: indexAccessNodeId,
    type: ENodeType.INDEX_ACCESS_NODE,
    data: {
      label: astNode.operator,
      type: ENodeType.INDEX_ACCESS_NODE,
      inputs: [
        {
          id: "left",
          type: EDataType.ARRAY,
          label: "",
        },
        {
          id: "right",
          type: rightNode.type,
          label: "",
        },
      ],
      outputs: [
        {
          id: "output",
          type: EDataType.ANY,
          label: "",
        },
      ],
    },
    position,
  };

  nodes.push(indexAccessNode);
  edges.push({
    source: rightNode.isParameter
      ? functionInfo.functionStartId
      : rightNode?.nodeId,
    sourceHandle: rightNode.isParameter ? rightNode.label : "output",
    target: indexAccessNodeId,
    targetHandle: `right`,
    id: `${rightNode?.nodeId}-${indexAccessNodeId}-right`,
    type: "bezier",
    style: { stroke: getEdgeColor(rightNode.type) },
  });
  return {
    nodeId: indexAccessNodeId,
    handleId: "output",
    type: EDataType.ANY,
    label: astNode.operator,
  };
};

export const createStringLiteralNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const stringNodeId = Math.random().toString(36).substr(2, 15);
  const stringNode = {
    id: stringNodeId,
    type: ENodeType.VARIABLE_NODE,
    data: {
      label: astNode.value,
      type: ENodeType.VARIABLE_NODE,
      inputs: [],
      outputs: [
        {
          id: `output`,
          type: EDataType.STRING,
          label: astNode.value,
        },
      ],
    },
    position,
  };
  nodes.push(stringNode);

  return {
    nodeId: stringNodeId,
    handleId: "output",
    type: EDataType.STRING,
    label: astNode.value,
  };
};

export const createFunctionCallNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const requireNodeId = Math.random().toString(36).substr(2, 15);
  const rightNodeId = Math.random().toString(36).substr(2, 15);

  const leftNode = traverse(
    astNode.arguments[0],
    {
      x: position.x - 500,
      y: position.y + 100,
    },
    functionInfo
  );

  const rightNode = traverse(
    astNode.arguments[1],
    {
      x: position.x - 500,
      y: position.y + 200,
    },
    functionInfo
  );

  const requireNode = {
    id: requireNodeId,
    type: ENodeType.REQUIRE_NODE,
    data: {
      label: astNode.operator,
      type: ENodeType.REQUIRE_NODE,
      operation: operatorToNodeType(astNode.operator),
      inputs: [
        {
          id: "execute",
          type: EDataType.EXECUTE,
          label: "",
        },
        {
          id: "left",
          type: EDataType.BOOL,
          label: "Condition",
        },
        {
          id: "right",
          type: EDataType.STRING,
          label: "Revert Message",
        },
      ],
      outputs: [
        {
          id: "execute",
          type: EDataType.EXECUTE,
          label: "",
        },
      ],
    },
    position,
  };

  nodes.push(requireNode);
  edges.push({
    source: leftNode.isParameter
      ? functionInfo.functionStartId
      : leftNode?.nodeId,
    sourceHandle: leftNode.isParameter ? leftNode.label : "output",
    target: requireNodeId,
    targetHandle: "left",
    id: `${leftNode?.nodeId}-${requireNodeId}-left`,
    type: "bezier",
    style: { stroke: getEdgeColor(EDataType.BOOL) },
  });
  edges.push({
    source: rightNode.isParameter
      ? functionInfo.functionStartId
      : rightNode?.nodeId,
    sourceHandle: rightNode.isParameter ? rightNode.label : "output",
    target: requireNodeId,
    targetHandle: `right`,
    id: `${rightNode?.nodeId}-${requireNodeId}-right`,
    type: "bezier",
    style: { stroke: getEdgeColor(EDataType.STRING) },
  });
  return {
    nodeId: requireNodeId,
    handleId: "output",
    type: leftNode.type,
    label: astNode.operator,
  };
};

export const createNumberLiteralNode = (
  traverse: any,
  astNode: any,
  position: any,
  functionInfo: any,
  nodes: any,
  edges: any
) => {
  const isAddress = astNode.number.startsWith("0x");
  const numberNodeId = Math.random().toString(36).substr(2, 15);
  const numberNode = {
    id: numberNodeId,
    type: ENodeType.VARIABLE_NODE,
    data: {
      label: astNode.number,
      type: ENodeType.VARIABLE_NODE,
      inputs: [],
      outputs: [
        {
          id: `output`,
          type: isAddress ? EDataType.ADDRESS : EDataType.UINT_256,
          label: astNode.number,
        },
      ],
    },
    position,
  };
  nodes.push(numberNode);

  return {
    nodeId: numberNodeId,
    handleId: "output",
    type: isAddress ? EDataType.ADDRESS : EDataType.UINT_256,
    label: astNode.number,
  };
};
