import {
  EDataType,
  EFunctionType,
  ENodeType,
  IASTSourceUnit,
  IASTVariableDeclaration,
  IReactFlowEdge,
  IReactFlowNode,
} from "@/types";
import { getEdgeColor } from "@/utils";
import { Node } from "reactflow";
import {
  createBooleanLiteralNode,
  createComparisonNode,
  createFunctionCallNode,
  createIndexAccessNode,
  createMemberAccessNode,
  createNumberLiteralNode,
  createOperatorNode,
  createSetterNode,
  createStringLiteralNode,
} from "./Creators";

interface Variable {
  type: string;
  name: string;
  parameter: boolean;
  isStateVariable?: boolean;
}

interface IStruct {
  name: string;
  variables: VariableObject;
}

interface IStructObject {
  [key: string]: Variable;
}

interface VariableObject {
  [key: string]: Variable;
}

const createVariable = (
  variable: IASTVariableDeclaration,
  isStateVariable: boolean
) => {
  if (variable.typeName.type === "ElementaryTypeName") {
    return {
      name: variable.name,
      type: variable.typeName.name,
      parameter: false,
      isStateVariable,
    };
  } else if (variable.typeName.type === "Mapping") {
    return {
      name: variable.name,
      type: "mapping",
      parameter: false,
      key: variable.typeName.keyType.name,
      keyType: variable.typeName.keyType.type,
      value:
        variable.typeName.valueType.type === "UserDefinedTypeName"
          ? variable.typeName.valueType.namePath
          : variable.typeName.valueType.name,
      valueType: variable.typeName.valueType.type,
    };
  } else if (variable.typeName.type === "ArrayTypeName") {
    if (variable.typeName.baseTypeName.type === "ElementaryTypeName") {
      return {
        name: variable.name,
        type: "array",
        parameter: false,
        isStateVariable,
      };
    } else {
      return {
        name: variable.name,
        type: "array",
        value: variable.typeName.baseTypeName.namePath,
        valueType: variable.typeName.baseTypeName.type,
        isStateVariable,
      };
    }
  }
};

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

export const traverseAST = (ast: IASTSourceUnit) => {
  let nodes: IReactFlowNode[] = [];
  let edges: IReactFlowEdge[] = [];
  const variables: VariableObject = {};
  const structs: IStructObject = {};

  const traverse = (
    astNode,
    position: { x: number; y: number },
    functionInfo: { functionStartId: string; functionEndId: string }
  ) => {
    switch (astNode?.type) {
      case "ExpressionStatement": {
        const { nodeId } = traverse(astNode.expression, position, functionInfo);

        return {
          nodeId,
        };
      }
      case "IfStatement": {
        const { nodeId } = traverse(astNode.condition, position, functionInfo);

        return {
          nodeId,
        };
      }
      case "FunctionCall": {
        return createFunctionCallNode(
          traverse,
          astNode,
          position,
          functionInfo,
          nodes,
          edges
        );
      }
      case "Identifier":
        const variableNodeId = Math.random().toString(36).substr(2, 15);

        const name = astNode.name === "msg" ? "msg.sender" : astNode.name;

        const isParameter = variables[name]?.parameter;

        if (!isParameter) {
          const variableNode = {
            id: variableNodeId,
            type: ENodeType.VARIABLE_NODE,
            data: {
              isParameter,
              label: astNode.name,
              type: ENodeType.VARIABLE_NODE,
              inputs: [],
              outputs: [
                {
                  id: `output`,
                  type: variableToDataType(variables[name]),
                  label: name,
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
          type: variableToDataType(variables[name]),
          variableName: name,
          label: name,
          isParameter,
        };
      case "NumberLiteral":
        return createNumberLiteralNode(
          traverse,
          astNode,
          position,
          functionInfo,
          nodes,
          edges
        );
      case "StringLiteral":
        return createStringLiteralNode(
          traverse,
          astNode,
          position,
          functionInfo,
          nodes,
          edges
        );
      case "BooleanLiteral":
        return createBooleanLiteralNode(
          traverse,
          astNode,
          position,
          functionInfo,
          nodes,
          edges
        );
      case "MemberAccess": {
        return createMemberAccessNode(
          traverse,
          astNode,
          position,
          functionInfo,
          nodes,
          edges,
          variables
        );
      }
      case "IndexAccess": {
        return createIndexAccessNode(
          traverse,
          astNode,
          position,
          functionInfo,
          nodes,
          edges
        );
      }
      case "BinaryOperation": {
        if (astNode.operator === "=") {
          return createSetterNode(
            traverse,
            astNode,
            position,
            functionInfo,
            nodes,
            edges
          );
        } else if (
          astNode.operator === "<" ||
          astNode.operator === ">" ||
          astNode.operator === "=="
        ) {
          return createComparisonNode(
            traverse,
            astNode,
            position,
            functionInfo,
            nodes,
            edges
          );
        } else {
          return createOperatorNode(
            traverse,
            astNode,
            position,
            functionInfo,
            nodes,
            edges
          );
        }
      }
      default:
        return {
          nodeId: "wut",
        };
    }
  };

  ast.children?.forEach((child) => {
    if (child.type === "ContractDefinition") {
      let functionYPosition = -750;

      child.subNodes?.forEach((subNode) => {
        if (subNode.type === "VariableDeclaration") {
          const v = createVariable(subNode, false);
          variables[subNode.name] = {
            ...v,
            isStateVariable: false,
          };
        }

        if (subNode.type === "StateVariableDeclaration") {
          subNode.variables?.forEach((variable) => {
            const v = createVariable(variable, true);
            variables[variable.name] = {
              ...v,
              isStateVariable: true,
            };
          });
        }

        if (subNode.type === "StructDefinition") {
          const structMembers = {};
          subNode.members?.forEach((member) => {
            structMembers[member.name] = {
              name: member.name,
              type: member.typeName.name,
              parameter: false,
            };
          });
          structs[subNode.name] = {
            name: subNode.name,
            type: "struct",
            parameter: false,
            members: structMembers,
          };
        }

        if (subNode.type === "FunctionDefinition") {
          // const [functionDeclarationNode, functionReturnNode] =
          //   createFunctionDeclarationAndReturnNodes(subNode);

          const functionStartId = Math.random().toString(36).substr(2, 15);
          const functionEndId = Math.random().toString(36).substr(2, 15);

          functionYPosition += 750;

          variables["msg.sender"] = {
            name: "msg.sender",
            type: "address",
            parameter: false,
            isStateVariable: false,
          };

          const functionName = subNode.isConstructor
            ? "Constructor"
            : subNode.name;

          const functionDeclarationNode: Node = {
            id: functionStartId,
            type: ENodeType.FUNCTION_NODE,
            data: {
              isConstructor: subNode.isConstructor,
              label: `${functionName} - Start`,
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

          const returnParams = subNode.returnParameters
            ? subNode?.returnParameters?.map((param: any) => ({
                id: param?.name,
                type: param?.typeName?.name,
                label: param?.name,
              }))
            : [];

          nodes = [...nodes, functionDeclarationNode];
          if (subNode.type === "FunctionDefinition") {
            // Add variables for the function parameters
            subNode.parameters?.forEach((parameter) => {
              if (parameter?.name)
                variables[parameter?.name] = {
                  name: parameter?.name ?? "",
                  type: parameter?.typeName.name ?? "",
                  parameter: true,
                  isStateVariable: false,
                };
            });
            // Add variables for the function return parameters
            subNode.returnParameters?.forEach((parameter) => {
              if (parameter?.name)
                variables[parameter?.name] = {
                  name: parameter?.name ?? "",
                  type: parameter?.typeName.name ?? "",
                  parameter: false,
                  isStateVariable: false,
                };
            });
          }

          if (subNode.body) {
            const statementsToTraverse = subNode.body.statements?.filter(
              (statement) => {
                if (
                  statement.type === "ExpressionStatement" ||
                  statement.type === "IfStatement"
                ) {
                  return true;
                } else if (statement.type === "VariableDeclarationStatement") {
                  statement.variables?.forEach((variable) => {
                    variables[variable.name] = {
                      name: variable.name,
                      type: variable.typeName.name,
                      parameter: false,
                      isStateVariable: false,
                    };
                  });
                }

                return false;
              }
            );

            const execNodeIds = [functionStartId];

            var xUpdate = 1000;
            var yUpdate = 0;

            statementsToTraverse?.forEach((statement, index) => {
              const { nodeId } = traverse(
                statement,
                {
                  x: xUpdate,
                  y: functionYPosition,
                },
                {
                  functionStartId,
                  functionEndId,
                }
              );

              execNodeIds.push(nodeId);

              edges.push({
                source: execNodeIds[index],
                sourceHandle: "execute",
                target: nodeId,
                targetHandle: "execute",
                id: `${execNodeIds[index]}-${nodeId}-execute`,
                type: "bezier",
                style: { stroke: getEdgeColor(EDataType.EXECUTE) },
              });

              xUpdate += 500;

              if (index === statementsToTraverse.length - 1) {
                edges.push({
                  source: nodeId,
                  sourceHandle: "execute",
                  target: functionEndId,
                  targetHandle: "execute",
                  id: `${nodeId}-${functionEndId}-execute`,
                  type: "bezier",
                  style: {
                    stroke: getEdgeColor(EDataType.EXECUTE),
                  },
                });
              }
            });

            const functionReturnNode: Node = {
              id: functionEndId,
              type: ENodeType.FUNCTION_NODE,
              data: {
                label: `${functionName} - End`,
                type: ENodeType.FUNCTION_NODE,
                operation: EFunctionType.END,
                inputs: [
                  {
                    id: "execute",
                    type: EDataType.EXECUTE,
                    label: "",
                  },
                  ...returnParams,
                ],
                outputs: [],
              },
              position: {
                x: statementsToTraverse.length * 500 + 1000,
                y: functionYPosition,
              },
            };

            nodes.push(functionReturnNode);
          }
        }
      });
    }
  });

  return { nodes, edges, stateVariables: Object.values(variables) };
};
