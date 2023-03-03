import { AST, StatementsEntity } from "@/AstTypes";
import {
  EDataType,
  EFunctionType,
  ENodeType,
  EOperationType,
  Operators,
} from "@/types";
import { getEdgeColor } from "@/utils";
import { Node } from "reactflow";
import {
  createFunctionDeclarationAndReturnNodes,
  createOperatorNode,
  createVariableNode,
  createSetterNode,
  createEdge,
  createNodeId,
} from "./Creators";

interface Variable {
  type: string;
  name: string;
  parameter: boolean;
}
interface VariableObject {
  [key: string]: Variable;
}

const variableToDataType = (variable: Variable) => {
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

const operatorToNodeType = (operator: string) => {
  switch (operator) {
    case "+":
      return EOperationType.ADDITION;
    case "-":
      return EOperationType.SUBTRACTION;
  }
};

export const traverseAST = (ast: AST) => {
  let nodes = [];
  let edges = [];
  const variables: VariableObject = {};

  const traverse = (
    astNode,
    position: { x: number; y: number },
    functionInfo: { functionStartId: string; functionEndId: string }
  ) => {
    switch (astNode?.type) {
      case "Identifier":
        const variableNodeId = Math.random().toString(36).substr(2, 15);
        const isParameter = variables[astNode.name].parameter;

        if (!isParameter) {
          const variableNode = {
            id: variableNodeId,
            type: ENodeType.VARIABLE_NODE,
            data: {
              label: astNode.name,
              type: ENodeType.VARIABLE_NODE,
              inputs: [],
              outputs: [
                {
                  id: `output`,
                  type: variableToDataType(variables[astNode.name]),
                  label: astNode.name,
                },
              ],
            },
            position,
          };
          nodes.push(variableNode);
        }

        return {
          nodeId: variableNodeId,
          handleId: "output",
          type: variableToDataType(variables[astNode.name]),
          label: astNode.name,
          isParameter,
        };
      case "NumberLiteral":
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
      case "StringLiteral":
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
      case "BooleanLiteral":
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
      case "BinaryOperation": {
        if (astNode.operator === "=") {
          const setterId = Math.random().toString(36).substr(2, 15);

          const rightNode = traverse(
            astNode.right,
            {
              x: position.x - 500,
              y: position.y + 250,
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
                  label: "right",
                },
              ],
              outputs: [
                {
                  id: "execute",
                  type: EDataType.EXECUTE,
                  label: "",
                },
                {
                  id: `output`,
                  type: rightNode.type,
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
          //   type: "smoothstep",
          //   style: { stroke: getEdgeColor(EDataType.EXECUTE) },
          // });
          edges.push({
            source: rightNode?.nodeId,
            sourceHandle: "output",
            target: setterId,
            targetHandle: `right`,
            id: `${rightNode?.nodeId}-${setterId}-right`,
            type: "smoothstep",
            style: { stroke: getEdgeColor(rightNode.type) },
          });
          return {
            nodeId: setterId,
            handleId: "output",
            type: EDataType.EXECUTE,
            label: astNode.operator,
          };
        } else {
          const operatorNodeId = Math.random().toString(36).substr(2, 15);

          const leftNode = traverse(
            astNode.left,
            {
              x: position.x - 500,
              y: position.y,
            },
            functionInfo
          );

          const rightNode = traverse(
            astNode.right,
            {
              x: position.x - 500,
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
            type: "smoothstep",
            style: { stroke: getEdgeColor(leftNode.type) },
          });
          edges.push({
            source: rightNode.isParameter
              ? functionInfo.functionStartId
              : rightNode?.nodeId,
            sourceHandle: rightNode.isParameter ? rightNode.label : "output",
            target: operatorNodeId,
            targetHandle: `right`,
            id: `${rightNode?.nodeId}-${operatorNodeId}-right`,
            type: "smoothstep",
            style: { stroke: getEdgeColor(rightNode.type) },
          });
          return {
            nodeId: operatorNodeId,
            handleId: "output",
            type: leftNode.type,
            label: astNode.operator,
          };
        }
      }
      default:
        break;
    }
  };

  ast.children?.forEach((child) => {
    if (child.type === "ContractDefinition") {
      let functionYPosition = -750;

      child.subNodes?.forEach((subNode) => {
        if (subNode.type === "StateVariableDeclaration") {
          subNode.variables?.forEach((variable) => {
            variables[variable.name] = {
              name: variable.name,
              type: variable.typeName.name,
              parameter: false,
            };
          });
        }
        if (subNode.type === "VariableDeclaration") {
          subNode.variables?.forEach((variable) => {
            variables[variable.name] = {
              name: variable.name,
              type: variable.typeName.name,
              parameter: false,
            };
          });
        }

        if (subNode.type === "FunctionDefinition") {
          // const [functionDeclarationNode, functionReturnNode] =
          //   createFunctionDeclarationAndReturnNodes(subNode);

          const functionStartId = Math.random().toString(36).substr(2, 15);
          const functionEndId = Math.random().toString(36).substr(2, 15);

          functionYPosition += 750;

          const functionDeclarationNode: Node = {
            id: functionStartId,
            type: ENodeType.FUNCTION_NODE,
            data: {
              label: "Function Start",
              type: ENodeType.FUNCTION_NODE,
              operation: EFunctionType.START,
              inputs: [], // Function declarations have no inputs, just outputs.
              outputs: [
                {
                  id: "execute",
                  type: EDataType.EXECUTE,
                  label: "",
                },
                ...subNode.parameters?.map((param: any) => ({
                  id: param?.name,
                  type: param?.typeName?.name,
                  label: param?.name,
                })),
              ],
            },
            position: { x: 0, y: functionYPosition },
          };

          const functionReturnNode: Node = {
            id: functionEndId,
            type: ENodeType.FUNCTION_NODE,
            data: {
              label: "Function End",
              type: ENodeType.FUNCTION_NODE,
              operation: EFunctionType.END,
              inputs: [
                {
                  id: "execute",
                  type: EDataType.EXECUTE,
                  label: "",
                },
                ...subNode?.returnParameters?.map((param: any) => ({
                  id: param?.name,
                  type: param?.typeName?.name,
                  label: param?.name,
                })),
              ],
              outputs: [],
            },
            position: { x: 1000, y: functionYPosition },
          };

          nodes = [...nodes, functionDeclarationNode, functionReturnNode];
          if (subNode.type === "FunctionDefinition") {
            // Add variables for the function parameters
            subNode.parameters?.forEach((parameter) => {
              if (parameter?.name)
                variables[parameter?.name] = {
                  name: parameter?.name ?? "",
                  type: parameter?.typeName.name ?? "",
                  parameter: true,
                };
            });
            // Add variables for the function return parameters
            subNode.returnParameters?.forEach((parameter) => {
              if (parameter?.name)
                variables[parameter?.name] = {
                  name: parameter?.name ?? "",
                  type: parameter?.typeName.name ?? "",
                  parameter: false,
                };
            });
          }

          if (subNode.body) {
            // Handle statement bodies
            subNode.body.statements?.forEach(
              (statement: StatementsEntity | null | undefined) => {
                if (statement?.type === "VariableDeclarationStatement") {
                  // Push local variables to the variables object
                  statement.variables?.forEach((variable) => {
                    variables[variable.name] = {
                      name: variable.name,
                      type: variable.typeName.name,
                      parameter: false,
                    };
                  });
                }

                if (
                  statement?.type === "ExpressionStatement" &&
                  statement.expression
                ) {
                  const { nodeId } = traverse(
                    statement.expression,
                    {
                      x: 500,
                      y: functionYPosition,
                    },
                    {
                      functionStartId,
                      functionEndId,
                    }
                  );

                  edges.push({
                    source: functionStartId,
                    sourceHandle: "execute",
                    target: nodeId,
                    targetHandle: "execute",
                    id: `${functionStartId}-${nodeId}-execute`,
                    type: "smoothstep",
                    style: { stroke: getEdgeColor(EDataType.EXECUTE) },
                  });

                  edges.push({
                    source: nodeId,
                    sourceHandle: "execute",
                    target: functionEndId,
                    targetHandle: "execute",
                    id: `${nodeId}-${functionEndId}-execute`,
                    type: "smoothstep",
                    style: { stroke: getEdgeColor(EDataType.EXECUTE) },
                  });
                }
              }
            );
          }
        }
      });
    }
  });

  console.log(nodes);
  console.log(edges);
  return { nodes, edges };
};
