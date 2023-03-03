import { Node } from "reactflow";
import {
  AST,
  StatementsEntity,
  Expression,
  ExpressionOrRight,
  ENodeInputOutputType,
  Input,
  NodeTypes,
  OperatorNode,
  Operators,
  Output,
  EDataType,
} from "@/types";

const LineColors = {
  green: "#228B22",
  blue: "#0F52BA",
  purple: "#BF00FF",
  red: "#FF2400",
  orange: "#FF8C00",
  yellow: "#FFD700",
  pink: "#FF00FF",
  white: "#FFFFFF",
};

const HandleColors = {
  green: "#228B22",
  blue: "#0F52BA",
  purple: "#BF00FF",
  red: "#FF2400",
  orange: "#FF8C00",
  yellow: "#FFD700",
  pink: "#FF00FF",
  white: "#FFFFFF",
};

export const getEdgeColor = (type: EDataType) => {
  switch (type) {
    case EDataType.UINT_256:
      return LineColors.green;
    case EDataType.STRING:
      return LineColors.pink;
    case EDataType.ADDRESS:
      return LineColors.yellow;
    case EDataType.INT_256:
      return LineColors.blue;
    case EDataType.STRUCT:
      return LineColors.purple;
    case EDataType.MAPPING:
      return LineColors.orange;
    default:
      return LineColors.white;
  }
};

export const getHandleColor = (type: EDataType) => {
  switch (type) {
    case EDataType.UINT_256:
      return HandleColors.green;
    case EDataType.STRING:
      return HandleColors.pink;
    case EDataType.ADDRESS:
      return HandleColors.yellow;
    case EDataType.INT_256:
      return HandleColors.blue;
    case EDataType.STRUCT:
      return HandleColors.purple;
    case EDataType.MAPPING:
      return HandleColors.orange;
    default:
      return HandleColors.white;
  }
};

interface Variable {
  id: string;
  type: string;
  name: string;
}
interface VariableObject {
  [key: string]: Variable;
}

export const traverseAST = (ast: AST) => {
  let nodes: Node[] = [];
  const variables: VariableObject = {};
  const stateVariables: VariableObject = {};

  ast.children?.forEach((child, index) => {
    if (child.type === "ContractDefinition") {
      child.subNodes?.forEach((subNode) => {
        if (subNode.type === "StateVariableDeclaration") {
          subNode.variables?.forEach((variable) => {
            stateVariables[variable.name] = {
              name: variable.name,
              id: variable.name,
              type: variable.typeName.name,
            };
          });
        }
        if (subNode.type === "VariableDeclaration") {
          subNode.variables?.forEach((variable) => {
            variables[variable.name] = {
              name: variable.name,
              id: variable.name,
              type: variable.typeName.name,
            };
          });
        }
        if (subNode.type === "FunctionDefinition") {
          const inputs =
            subNode.parameters?.map((parameter) => parameter?.name) || [];
          const outputs =
            subNode.returnParameters?.map((parameter) => parameter?.name) || [];

          // Create the function declaration and return nodes.
          const functionDeclarationNode: Node = {
            id: "function-start",
            data: {
              id: subNode?.name ?? "constructor" + index ?? "0",
              type: NodeTypes.FunctionNode,
              inputs,
              outputs: [], // Outputs nothing, draw execution line somehow
            },
            position: { x: 0, y: 0 },
          };

          const functionReturnNode: Node = {
            id: "function-end",
            data: {
              label: subNode?.name ?? "constructor" + index ?? "0",
              type: NodeTypes.FunctionNode,
              inputs: [], // Inputs nothing, draw execution line somehow.
              outputs,
            },
            position: { x: 0, y: 0 },
          };
          nodes = [...nodes, functionDeclarationNode, functionReturnNode];
          if (subNode.body) {
            let statements = subNode.body.statements;
            statements?.forEach(
              (statement: StatementsEntity | null | undefined) => {
                if (statement?.type === "ExpressionStatement") {
                  const expression = statement?.expression;

                  if (expression?.type === "BinaryOperation") {
                    // If the expression is an assignment we need to create a setter function node.
                    // The setter function node just has an input for now. Need to figure out to handle the output.
                    // The input of the setter node should be the right side of the expression.
                    if (expression.operator === Operators.EQUALS) {
                      const inputs = [expression?.right?.name];
                      const setterId = `expression/set/${index}`;
                      const setterFunctionNode: Node = {
                        id: setterId,
                        data: {
                          label: "Setter",
                          type: NodeTypes.FunctionNode,
                          inputs,
                          outputs: findOuputForVariable(
                            expression?.left?.name ?? "",
                            nodes
                          ),
                        },
                        position: { x: 0, y: 0 },
                      };
                      nodes.push(setterFunctionNode);

                      const { nodes: newNodes } = bigRecursiveCreateNode(
                        expression,
                        nodes,
                        0
                      );
                      nodes = newNodes;
                    } else {
                      // If the expression is not an assignment we need to create an operator node.
                      // The operator node would have an input with the left and right
                      const left = expression?.left?.name;
                      const right = expression?.right?.name;
                      const operatorNodeId = `${expression.type}-${left}-${right}`;
                      const operatorNode: Node = {
                        id: operatorNodeId,
                        data: {
                          label: expression.operator,
                          type: NodeTypes.OPERATOR_NODE,
                          inputs: [left],
                        },
                        position: { x: 0, y: 0 },
                      };
                      const { nodes: newNodes } = bigRecursiveCreateNode(
                        expression,
                        nodes,
                        0
                      );
                      nodes = newNodes;
                    }
                  }
                }
              }
            );
          }
        }
      });
    }
  });

  return nodes;
};
// recursively walks the right side of an expression statement, creating any necessary nodes along de wei.
const bigRecursiveCreateNode = (
  expression: Expression,
  nodes: Node[],
  depth: number
) => {
  // Necesary nodes will need to be created in the following cases:
  // If the right side of the expression is a binary operator, we need to create an operator node.
  // If the right side of the expression is a local or state variable we need to create a variable node. The output of the variable node will be any function that has the same name as a parameter.
  const { left, right } = expression;
  const inputs = [];
  if (right?.type === "BinaryOperation") {
    const { expression: leftInputNodes } = bigRecursiveCreateNode(
      right,
      nodes,
      depth + 1
    );
    const { expression: rightInputNodes } = bigRecursiveCreateNode(
      left as ExpressionOrRight,
      nodes,
      depth + 1
    );
    const operatorId = `node/operation/${right.operator}`;
    const operatorNode: Node = {
      id: operatorId,
      data: {
        label: right.name,
        type: NodeTypes.OPERATOR_NODE,
        //@ts-ignore
        inputs: [rightInputNodes, leftInputNodes],
        outputs: findOuputForVariable(right.name ?? "", nodes),
        operator: right.operator,
      },
      position: { x: 0, y: 0 },
    };
    nodes.push(operatorNode);
  }

  if (right?.type === "Identifier") {
    const variableNode: Node = {
      id: right.name ?? "",
      data: {
        label: right.name,
        type: NodeTypes.VariableNode,
        outputs: findOuputForVariable(right.name ?? "", nodes),
      },
      position: { x: 0, y: 0 },
    };
    nodes.push(variableNode);
  }
  return {
    nodes,
    expression,
  };
};

const findOuputForVariable = (variableName: string, nodes: Node[]) => {
  // @ts-ignore
  return nodes.reduce(
    (acc: { id: string; type: EDataType; label?: string }[], node) => {
      if (node.data.type === NodeTypes.FunctionNode) {
        if (node.data.inputs.includes(variableName)) {
          acc.push({
            id: node.id,
            type: EDataType.EXECUTE,
          });
        }
      }
      if (node.data.type === NodeTypes.OPERATOR_NODE) {
        acc.push({
          id: node.id,
          type: EDataType.EXECUTE,
        });
      }
      return acc;
    },
    []
  );
};

// export const exampleNodes = [
//   {
//     id: `node/function-start`,
//     type: ENodeType.FUNCTION_NODE,
//     data: {
//       label: `Add to Amount Added`,
//       type: ENodeType.FUNCTION_NODE,
//       operation: EFunctionType.START,
//       inputs: [],
//       outputs: [
//         {
//           id: "node/function-start/execute",
//           type: EDataType.EXECUTE,
//           label: "Execute",
//         },
//         {
//           id: "node/function-start/number-to-add",
//           type: EDataType.UINT_256,
//           label: "Number to Add",
//         },
//       ],
//     },
//     position: { x: 0, y: 0 },
//   },
//   {
//     id: `node/function-end`,
//     type: ENodeType.FUNCTION_NODE,
//     data: {
//       label: `Return Node`,
//       type: ENodeType.FUNCTION_NODE,
//       operation: EFunctionType.END,
//       inputs: [
//         {
//           id: "node/function-end/input/execute",
//           type: EDataType.EXECUTE,
//           label: "",
//         },
//         {
//           id: "node/function-end/input/new-total",
//           type: EDataType.UINT_256,
//           label: "New Total",
//         },
//       ],
//       outputs: [],
//     },
//     position: { x: 1000, y: 0 },
//   },
//   {
//     id: "node/variable/total-number",
//     type: ENodeType.VARIABLE_NODE,
//     data: {
//       label: "Total Number",
//       type: ENodeType.VARIABLE_NODE,
//       operation: EDataType.UINT_256,
//       inputs: [],
//       outputs: [
//         {
//           id: "node/variable/output-total-number",
//           type: EDataType.UINT_256,
//           label: "Total Number",
//         },
//       ],
//     },
//     position: { x: 1000, y: 1000 },
//   },
//   {
//     id: "node/operation/add",
//     type: ENodeType.OPERATION_NODE,
//     data: {
//       label: "Addition",
//       type: ENodeType.OPERATION_NODE,
//       operation: EOperationType.ADDITION,
//       inputs: [
//         {
//           id: "node/operation/add/input/number-to-add",
//           type: EDataType.UINT_256,
//           label: "",
//         },
//         {
//           id: "node/operation/add/input/total-number",
//           type: EDataType.UINT_256,
//           label: "",
//         },
//       ],
//       outputs: [
//         {
//           id: "node/operation/add/output/number-to-add-plus-total-number",
//           type: EDataType.UINT_256,
//           label: "",
//         },
//       ],
//     },
//     position: { x: 500, y: 500 },
//   },
//   {
//     id: "node/expression/set",
//     type: ENodeType.EXPRESSION_NODE,
//     data: {
//       label: "Set",
//       type: ENodeType.EXPRESSION_NODE,
//       inputs: [
//         {
//           id: "node/expression/set/input/execute",
//           type: EDataType.EXECUTE,
//           label: "",
//         },
//         {
//           id: "node/expression/set/input/old-plus-new",
//           type: EDataType.UINT_256,
//           label: "Old Plus New",
//         },
//       ],
//       outputs: [
//         {
//           id: "node/expression/set/output/execute",
//           type: EDataType.EXECUTE,
//           label: "",
//         },
//       ],
//     },
//     position: { x: 1000, y: 500 },
//   },
// ];

export const exampleEdges = [
  {
    source: "node/variable/total-number",
    sourceHandle: "output",
    target: "node/operation/add",
    targetHandle: "second-number",
    id: "reactflow__edge-node/variable/total-numberoutput-node/operation/addsecond-number",
    type: "smoothstep",
  },
  {
    source: "node/function-start",
    sourceHandle: "output",
    target: "node/operation/add",
    targetHandle: "first-number",
    id: "reactflow__edge-node/function-startoutput-node/operation/addfirst-number",
    type: "smoothstep",
  },
  {
    source: "node/function-start",
    sourceHandle: "execute",
    target: "node/expression/set",
    targetHandle: "execute",
    id: "reactflow__edge-node/function-startexecute-node/expression/setexecute",
    type: "smoothstep",
  },
  {
    source: "node/operation/add",
    sourceHandle: "output",
    target: "node/expression/set",
    targetHandle: "old-plus-new",
    id: "reactflow__edge-node/operation/addoutput-node/expression/setold-plus-new",
    type: "smoothstep",
  },
  {
    source: "node/expression/set",
    sourceHandle: "execute",
    target: "node/function-end",
    targetHandle: "execute",
    id: "reactflow__edge-node/expression/setexecute-node/function-endexecute",
    type: "smoothstep",
  },
  {
    source: "node/expression/set",
    sourceHandle: "old-plus-new",
    target: "node/function-end",
    targetHandle: "output",
    id: "reactflow__edge-node/expression/setold-plus-new-node/function-endoutput",
    type: "smoothstep",
  },
];

export enum ENodeType {
  VARIABLE_NODE = "VARIABLE_NODE",
  FUNCTION_NODE = "FUNCTION_NODE",
  OPERATION_NODE = "OPERATION_NODE",
  EXPRESSION_NODE = "EXPRESSION_NODE",
}

export enum EOperationType {
  ADDITION = "ADDITION",
  SUBTRACTION = "SUBTRACTION",
  MULTIPLICATION = "MULTIPLICATION",
  DIVISION = "DIVISION",
}

export enum EFunctionType {
  START = "START",
  END = "END",
}
