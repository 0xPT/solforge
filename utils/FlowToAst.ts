import {
  IReactFlowNode,
  IReactFlowEdge,
  IASTSourceUnit,
  IASTFunctionDefinition,
  IASTVariableDeclarationStatement,
  ENodeType,
  EDataType,
  IASTContractDefinition,
  EFunctionType,
} from "@/types";
import { isLiteral } from "./Creators";

export const convertNodesToAST = (
  nodes: IReactFlowNode[],
  edges: IReactFlowEdge[],
  variables: any
): IASTSourceUnit => {
  console.log(nodes);
  const stateVariables = variables
    .filter((variable) => {
      if (variable.isStateVariable) {
        return true;
      }
    })
    .map((variable) => {
      return {
        type: "StateVariableDeclaration",
        variables: [
          {
            typeName: {
              type: "ElementaryTypeName",
              name: variable.type,
              range: [0, 0],
            },
            type: "VariableDeclaration",
            visibility: "public",
            expression: null,
            name: variable.name,
            isStateVar: true,
            isIndexed: false,
            isDeclaredConst: false,
            range: [0, 0],
          },
        ],
        initialValue: null,
      };
    });
  const ContractDefinition: IASTContractDefinition = {
    type: "ContractDefinition",
    name: "Contract",
    subNodes: [...stateVariables],
    baseContracts: [],
    kind: "Contract",
  };
  const ast: IASTSourceUnit = {
    type: "SourceUnit",
    children: [
      {
        type: "PragmaDirective",
        name: "solidity",
        value: "0.8.8",
        range: [0, 0],
      },
      ContractDefinition,
    ],
    range: [0, 0],
  };

  const getNodeById = (id: string): IReactFlowNode | undefined => {
    return nodes.find((node) => node.id === id);
  };

  const getInputNodes = (
    node: IReactFlowNode
  ): IReactFlowNode[] | undefined => {
    const newNodes: IReactFlowNode[] = [];
    node.data.inputs?.forEach((input) => {
      const edge = edges.find(
        (edge) => edge.target === node.id && input.id === edge.targetHandle
      );

      if (edge) {
        const node = getNodeById(edge.source);
        if (node) newNodes.push(node);
      }
    });
    if (newNodes) return newNodes;
    else return undefined;
  };

  const AddToAst = (currentNode: IReactFlowNode, dataSource: any) => {
    const nodeType = currentNode.type;

    switch (nodeType) {
      case ENodeType.FUNCTION_NODE: {
        if (dataSource.operator === "=") {
          if (!dataSource.right) {
            dataSource.right = {
              type: "Identifier",
              name: (currentNode.data.outputs[1] as any).label, // Todo: fix
              range: [0, 0],
            };
          }
          if (!dataSource.left) {
            dataSource.left = {
              type: "Identifier",
              name:
                currentNode.data.label ??
                (currentNode.data.outputs[0] as any).label, // Todo: fix
              range: [0, 0],
            };
          }

          return dataSource;
        }

        const functionDefinition: IASTFunctionDefinition = {
          type: "FunctionDefinition",
          name: currentNode.data.label.split(" ")[0],
          parameters: [],
          returnParameters: [],
          body: {
            type: "Block",
            statements: [],
          },
          isConstructor: (currentNode.data as any).isConstructor,
          stateMutability: null,
          modifiers: [],
          visibility: "public",
          range: [0, 0],
        };

        currentNode.data.outputs.forEach((output) => {
          if (
            (currentNode.data.operation as EFunctionType) === EFunctionType.END
          ) {
            if (output.type != EDataType.EXECUTE) {
              functionDefinition.returnParameters.push({
                type: "VariableDeclaration",
                typeName: {
                  type: "ElementaryTypeName",
                  name: output.type,
                  range: [0, 0],
                },
                name: output.label,
                storageLocation: null,
                isStateVar: false,
                isIndexed: false,
                range: [0, 0],
              });
            }
          } else {
            if (output.type != EDataType.EXECUTE) {
              functionDefinition.parameters.push({
                type: "VariableDeclaration",
                typeName: {
                  type: "ElementaryTypeName",
                  name: output.type.toLowerCase(),
                  range: [0, 0],
                },
                name: output.label,
                storageLocation: null,
                isStateVar: false,
                isIndexed: false,
                range: [0, 0],
              });
            }
          }
        });

        if (Array.isArray(dataSource)) {
          dataSource.push(functionDefinition);
          return dataSource[stateVariables.length]?.body?.statements;
        }

        return;
      }
      // Handle variable declarations
      case ENodeType.VARIABLE_NODE: {
        console.log(currentNode);
        console.log(dataSource);
        // If the variable declaration is part of a binary operation the dataSource will contain the left side of a binary operation with existing data.
        // Below will add the right side of the binary operation to the dataSource.
        if (!(dataSource.type === "FunctionCall")) {
          if (!dataSource.right) {
            dataSource.right = {
              type: "Identifier",
              name:
                currentNode.data.label ??
                (currentNode.data.inputs[1] as any).value, // Todo: fix
              range: [0, 0],
            };
          }
          if (!dataSource.left) {
            dataSource.left = {
              type: "Identifier",
              name:
                currentNode.data.label ??
                (currentNode.data.inputs[0] as any).value, // Todo: fix
              range: [0, 0],
            };
          }
        }

        if (dataSource.type === "FunctionCall") {
          dataSource.arguments[1] = {
            type: "StringLiteral",
            value: currentNode.data.label,
            range: [0, 0],
          };
        }

        const variableDeclaration: IASTVariableDeclarationStatement = {
          type: "VariableDeclarationStatement",
          variables: [],
          initialValue: null,
          range: [0, 0],
        };
        currentNode.data.outputs.forEach((output) => {
          variableDeclaration.variables.push({
            type: "VariableDeclaration",
            typeName: {
              type: "ElementaryTypeName",
              name: output.type.toLowerCase(),
              range: [0, 0],
            },
            name: output.label,
            storageLocation: null,
            isStateVar: false,
            isIndexed: false,
            range: [0, 0],
          });
        });

        if (Array.isArray(dataSource)) {
          dataSource.push(variableDeclaration);
        }
        return dataSource;
      }
      case ENodeType.OPERATION_NODE: {
        const leftIsLiteral = isLiteral(currentNode.data.inputs[0].type);
        const rightIsLiteral = isLiteral(currentNode.data.inputs[1].type);

        const operationStatement = {
          type: "BinaryOperation",
          operator: currentNode.data.label,
          left: leftIsLiteral ? getLiteral(currentNode.data.inputs[0]) : null,
          right: rightIsLiteral ? getLiteral(currentNode.data.inputs[1]) : null,
        };

        dataSource.right = operationStatement;
        if (dataSource.operator === "=") {
          return dataSource.right;
        }
        return;
      }
      case ENodeType.REQUIRE_NODE: {
        console.log("require node", currentNode);

        const requireStatement = {
          type: "ExpressionStatement",
          expression: {
            type: "FunctionCall",
            expression: {
              type: "Identifier",
              name: "require",
              range: [0, 0],
            },
            arguments: [
              {},
              {
                type: "StringLiteral",
                value: currentNode.data.inputs[2].value,
                range: [0, 0],
              },
            ],
          },
        };

        if (Array.isArray(dataSource)) {
          dataSource.push(requireStatement);
        }

        return requireStatement.expression;
      }
      case ENodeType.COMPARISON_NODE: {
        const leftIsLiteral = isLiteral(currentNode.data.inputs[0].type);
        const rightIsLiteral = isLiteral(currentNode.data.inputs[1].type);

        const comparisonStatement = {
          type: "BinaryOperation",
          operator: currentNode.data.label,
          left: leftIsLiteral ? getLiteral(currentNode.data.inputs[0]) : null,
          right: rightIsLiteral ? getLiteral(currentNode.data.inputs[1]) : null,
        };

        dataSource.arguments[0] = comparisonStatement;

        return comparisonStatement;
      }
      case ENodeType.EXPRESSION_NODE: {
        const isRightLiteral = isLiteral(currentNode.data.inputs[1].type);

        // Expression nodes should create an expression and variable declaration in the AST.
        const expressionStatement = {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryOperation",
            operator: "=",
            left: {
              type: "Identifier",
              name: currentNode.data.label.split(" ")[1],
              range: [0, 0],
            },
            right: isRightLiteral
              ? getLiteral(currentNode.data.inputs[1])
              : null,
          },
        };

        if (Array.isArray(dataSource)) {
          const isStateVariable =
            variables.findIndex(
              (v) => v.name === currentNode.data.label.split(" ")[1]
            ) > -1;

          if (!isStateVariable) {
            dataSource?.push(
              {
                type: "VariableDeclarationStatement",
                variables: [
                  {
                    name: currentNode.data.label.split(" ")[1],
                    type: "VariableDeclaration",
                    typeName: {
                      type: "ElementaryTypeName",
                      name: (currentNode.data as any).variableTypeName,
                      range: [0, 0],
                    },
                  },
                ],
              },
              expressionStatement
            );
          } else {
            dataSource?.push(expressionStatement);
          }
          if (isRightLiteral) {
            return;
          }
          return expressionStatement.expression;
        }

        return;
      }
    }
  };

  const traverse = (node: IReactFlowNode, dataSource: any) => {
    // expression_node
    // data source its going to be function.body.statements

    // operation_node
    //

    // adding to ast is doing datasource.right or datasource.left or datasource.push (which is only from a function)
    const newDataSource = AddToAst(node, dataSource);
    const inputNodes = getInputNodes(node);
    if (!inputNodes || !newDataSource) {
      return;
    }
    inputNodes?.forEach((node) => traverse(node, newDataSource));
  };

  const traversableNodes = nodes.filter((nd) => {
    if (nd.data.operation === EFunctionType.END) return;
    // Find the nodes where either the outputs or unputs contains an id of "execute"
    const hasExecuteOutput = nd.data.outputs.find((out) => {
      return out.id === "execute";
    });
    const hasInuptExecute = nd.data.inputs.find((inp) => {
      return inp.id === "execute";
    });
    return hasExecuteOutput || hasInuptExecute;
  });

  let index = stateVariables.length;

  traversableNodes.forEach((traversableNode) => {
    let dataSource;
    if (traversableNode.data.operation === EFunctionType.START) {
      dataSource = ContractDefinition.subNodes;
      index++;
    } else {
      dataSource = (ContractDefinition.subNodes[index - 1] as any).body
        .statements;
    }
    traverse(traversableNode as any, dataSource);
  });
  return ast;
};

const getLiteral = (input) => {
  const { id, label, type, value, variableName } = input;

  if (type == EDataType.STRING) {
    return {
      type: "Identifier",
      name: variableName,
      range: [0, 0],
    };
  } else if (type == EDataType.ADDRESS) {
    return {
      type: "MemberAccess",
      expression: {
        type: "Identifier",
        name: "msg",
        range: [275, 277],
      },
      memberName: "sender",
      range: [275, 284],
    };
  } else if (type == EDataType.BOOLEAN_LITERAL) {
    return {
      type: "BooleanLiteral",
      value: value,
      range: [0, 0],
    };
  } else if (type == EDataType.NUMBER_LITERAL) {
    return {
      type: "NumberLiteral",
      number: value,
      subdenomination: null,
      range: [0, 0],
    };
  } else {
    return {
      type: "Identifier",
      name: variableName,
      range: [0, 0],
    };
  }
};
