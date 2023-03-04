export enum EVariableTypes {
  BOOLEAN,
  INT,
  UINT,
  STRING,
  ADDRESS,
  MAPPING,
  STRUCT,
  ARRAY,
}

export interface IVariable {
  name: string;
  type: EVariableTypes;
}

export interface IFunction {
  name: string;
  inputs: IVariable[];
  outputs: IVariable[];
}

export enum Operators {
  ADD = "+",
  SUBTRACT = "-",
  EQUALS = "=", // assignment
  DOUBLE_EQUALS = "==", // comparison
}

export enum EDataType {
  EXECUTE = "execute",
  BOOL = "bool",
  INT_256 = "int256",
  UINT_256 = "uint256",
  STRING = "string",
  ADDRESS = "address",
  MAPPING = "mapping",
  STRUCT = "struct",
  ARRAY = "array",
  BOOLEAN_LITERAL = "BooleanLiteral",
  NUMBER_LITERAL = "NumberLiteral",
}

export interface IVariable {
  name: string;
  type: EVariableTypes;
}

export interface IFunction {
  name: string;
  inputs: IVariable[];
  outputs: IVariable[];
}

export interface IDataHandle {
  id: string;
  label: string;
  type: EDataType;
}

export interface Input {
  id: string;
  type: EDataType;
  label?: string | null;
}

export enum ENodeType {
  VARIABLE_NODE = "VARIABLE_NODE",
  FUNCTION_NODE = "FUNCTION_NODE",
  OPERATION_NODE = "OPERATION_NODE",
  COMPARISON_NODE = "COMPARISON_NODE",
  REQUIRE_NODE = "REQUIRE_NODE",
  EXPRESSION_NODE = "EXPRESSION_NODE",
  INDEX_ACCESS_NODE = "INDEX_ACCESS_NODE",
  MEMBER_ACCESS_NODE = "MEMBER_ACCESS_NODE",
}

export enum EOperationType {
  ADDITION = "ADDITION",
  SUBTRACTION = "SUBTRACTION",
  MULTIPLICATION = "MULTIPLICATION",
  DIVISION = "DIVISION",
}

export enum EComparisonType {
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
  DOUBLE_EQUALS = "EQUALS",
}

export enum EFunctionType {
  START = "START",
  END = "END",
}

export enum ENodeInputOutputType {
  Boolean = "boolean",
  String = "string",
  Address = "address",
  Uint256 = "uint256",
  Execute = "execute",
  Custom = "custom",
}

export enum EASTOperator {
  ADDITION = "+",
  SUBTRACTION = "-",
  MULTIPLICATION = "*",
  DIVISION = "/",
}

// React Flow Interfaces & Types

export interface IReactFlowNode {
  id: string;
  type: ENodeType;
  data: IDataHandle;
  position: { x: number; y: number };
  inputs: Input[];
  outputs: Input[];
}

export interface IReactFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

// AST Interfaces & Types

export type TASTStatement =
  | IASTExpressionStatement
  | IASTVariableDeclarationStatement
  | IASTReturnStatement;

export type TASTExpression =
  | IASTIdentifier
  | IASTBooleanLiteral
  | IASTNumberLiteral
  | IASTStringLiteral;

export type TASTRange = [number, number];

export type TVisibility = "public" | "private" | "internal" | "external";

export interface IASTIdentifier {
  type: "Identifier";
  name: string;
  range: TASTRange;
}

export interface IASTBooleanLiteral {
  type: "BooleanLiteral";
  value: boolean;
  range: TASTRange;
}

export interface IASTNumberLiteral {
  type: "NumberLiteral";
  number: `0x${string}`;
  subdenomination: null;
  range: TASTRange;
}

export interface IASTStringLiteral {
  type: "StringLiteral";
  value: string;
  range: TASTRange;
}

export interface IASTCondition {}

export interface IASTBlock {
  type: "Block";
  statements: TASTStatement[];
}

export interface IASTBinaryOperation {
  type: "BinaryOperation";
  operator: EASTOperator;
  left: TASTExpression;
  right: TASTExpression;
  range: TASTRange;
}

export interface IASTFunctionCall {
  type: "FunctionCall";
  expression: TASTExpression;
  arguments: TASTExpression[];
  names: string[];
  range: TASTRange;
}

export interface IASTElementaryTypeName {
  type: "ElementaryTypeName";
  name: string;
  range: TASTRange;
}

export interface IASTVariableDeclaration {
  type: "VariableDeclaration";
  typeName: IASTElementaryTypeName;
  name: string;
  storageLocation: any;
  isStateVar: boolean;
  isIndexed: boolean;
  range: TASTRange;
}

export interface IASTVariableDeclarationStatement {
  type:
    | "VariableDeclarationStatement"
    | "StateVariableDeclaration"
    | "VariableDeclaration"
    | "StructDefinition";
  variables: IASTVariableDeclaration[];
  initialValue: any;
  range: TASTRange;
}

export interface IASTReturnStatement {
  type: "ReturnStatement";
  expression: TASTExpression;
  range: TASTRange;
}

export interface IASTExpressionStatement {
  type: "ExpressionStatement";
  expression: TASTExpression;
  range: TASTRange;
}

export interface IASTFunctionDefinition {
  type: "FunctionDefinition";
  name: string;
  parameters: IASTVariableDeclaration[];
  returnParameters: IASTVariableDeclaration[];
  body: IASTBlock;
  isConstructor: boolean;
  stateMutability: any;
  modifiers: any[];
  visibility: TVisibility;
  range: TASTRange;
}

export interface IASTIfStatement {
  type: "IfStatement";
  condition: IASTBinaryOperation;
  trueBody: IASTBlock;
  falseBody: IASTBlock;
  range: TASTRange;
}

export interface IASTContractDefinition {
  type: "ContractDefinition";
  name: string;
  baseContracts: any[];
  subNodes: (IASTFunctionDefinition | IASTVariableDeclarationStatement)[];
}

export interface IASTPragmaDirective {
  type: "PragmaDirective";
  name: string;
  value: string;
  range: TASTRange;
}

export type TASTSourceUnitChildren =
  | IASTContractDefinition
  | IASTPragmaDirective;

export interface IASTSourceUnit {
  type: "SourceUnit";
  children: TASTSourceUnitChildren[];
  range: TASTRange;
}
