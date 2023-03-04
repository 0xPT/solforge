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

export const convertNodesToAST = (
  nodes: IReactFlowNode[],
  edges: IReactFlowEdge[]
): IASTSourceUnit => {
  const ContractDefinition: IASTContractDefinition = {
    type: "ContractDefinition",
    name: "Contract",
    subNodes: [],
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
        const functionDefinition: IASTFunctionDefinition = {
          type: "FunctionDefinition",
          name: currentNode.data.label.split(" ")[0],
          parameters: [],
          returnParameters: [],
          body: {
            type: "Block",
            statements: [],
          },
          isConstructor: currentNode.data.isConstructor,
          stateMutability: null,
          modifiers: [],
          visibility: "public",
          range: [0, 0],
        };
        currentNode.data.outputs.forEach((output) => {
          if (
            (currentNode.data.operation as EFunctionType) ===
            EFunctionType.START
          ) {
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
          } else {
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
        });

        if (Array.isArray(dataSource)) {
          dataSource.push(functionDefinition);
          return dataSource[0].body.statements;
        }

        break;
      }
      // Handle variable declarations
      case ENodeType.VARIABLE_NODE: {
        // If the variable declaration is part of a binary operation the dataSource will contain the left side of a binary operation with existing data.
        // Below will add the right side of the binary operation to the dataSource.
        if (dataSource.right) {
          dataSource.right = {
            type: "Identifier",
            name: currentNode.data.label ?? currentNode.data.inputs[1].value, // Todo: fix
            range: [0, 0],
          };
          return;
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
        dataSource.push(variableDeclaration);
        return dataSource;
      }
      case ENodeType.EXPRESSION_NODE: {
        console.log("sup");
        // If we are traversing through the first time, we need to create the expression statement.
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
            right: {
              type: "NumberLiteral",
              number: currentNode.data.inputs[1].value,
              range: [0, 0],
            },
          },
        };
        dataSource.push(
          {
            type: "VariableDeclarationStatement",
            variables: [
              {
                name: currentNode.data.label.split(" ")[1],
                type: "VariableDeclaration",
                typeName: {
                  type: "ElementaryTypeName",
                  name: currentNode.data.variableTypeName,
                  range: [0, 0],
                },
              },
            ],
          },
          expressionStatement
        );
        return expressionStatement.expression;
      }
    }
  };

  const traverse = (node: IReactFlowNode, dataSource: any) => {
    const newDataSource = AddToAst(node, dataSource);
    const inputNodes = getInputNodes(node);
    if (!inputNodes || !newDataSource) {
      return;
    }
    inputNodes?.forEach((node) => traverse(node, newDataSource));
  };

  // Start at the function start node and follow the execution path
  const functionStartNode = nodes.find(
    (node) => node.type === ENodeType.FUNCTION_NODE
  );
  const dataSource = AddToAst(
    functionStartNode as any,
    ContractDefinition.subNodes
  );

  const executionEdge = edges.find(
    (edge) =>
      edge.source === functionStartNode?.id && edge.sourceHandle === "execute"
  );
  const nextNode = getNodeById(executionEdge?.target as string);
  console.log(nextNode);
  traverse(nextNode as any, dataSource);

  return ast;
};
