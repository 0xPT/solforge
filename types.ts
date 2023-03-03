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

export enum NodeTypes {
  VariableNode = "VariableDeclarationNode",
  FunctionNode = "FUNCTION_NODE",
  EventNode = "EVENT_NODE",
  OPERATOR_NODE = "OPERATOR_NODE",
}

export enum Operators {
  ADD = "+",
  SUBTRACT = "-",
  EQUALS = "=", // assignment
  DOUBLE_EQUALS = "==", // comparison
}

export interface Input {
  source: string | null;
  name: string;
  type: ENodeInputOutputType;
}

export interface Output {
  target: string | null;
  name: string;
  type: ENodeInputOutputType;
}

export interface VariableDeclarationNode {
  id: string;
  type: NodeTypes.VariableNode;
  name: string;
  outputs: Output[];
}

export interface FunctionDeclarationNode {
  id: string;
  type: NodeTypes.FunctionNode;
  name: string;
  inputs: Input[]; // parameters
  outputs: Output[]; // return parameters
}

export interface OperatorNode {
  id: string;
  type: NodeTypes.OPERATOR_NODE;
  inputs: Input[];
  outputs: Output[];
  operator: Operators;
}

export enum EDataType {
  EXECUTE = "execute",
  BOOLEAN = "boolean",
  INT_256 = "int256",
  UINT_256 = "uint256",
  STRING = "string",
  ADDRESS = "address",
  MAPPING = "mapping",
  STRUCT = "struct",
  ARRAY = "array",
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

export enum ENodeInputOutputType {
  Boolean = "boolean",
  String = "string",
  Address = "address",
  Uint256 = "uint256",
  Execute = "execute",
  Custom = "custom",
}

export interface AST {
  type: string;
  children?: ChildrenEntity[] | null;
  range?: number[] | null;
}
export interface ChildrenEntity {
  type: string;
  name: string;
  value?: string | null;
  range?: number[] | null;
  baseContracts?: null[] | null;
  subNodes?: SubNodesEntity[] | null;
  kind?: string | null;
}
export interface SubNodesEntity {
  type: string;
  variables?: VariablesEntity[] | null;
  initialValue?: null;
  range?: number[] | null;
  name?: string | null;
  parameters?:
    | (ParametersEntityOrVariablesEntityOrReturnParametersEntity | null)[]
    | null;
  body?: Body | null;
  visibility?: string | null;
  modifiers?: null[] | null;
  isConstructor?: boolean | null;
  stateMutability?: string | null;
  returnParameters?: ReturnParametersEntity[] | null;
}
export interface VariablesEntity {
  type: string;
  typeName: TypeNameOrLeftOrRightOrExpression;
  name: string;
  expression?: null;
  visibility: string;
  isStateVar: boolean;
  isDeclaredConst: boolean;
  isIndexed: boolean;
  range?: number[] | null;
}
export interface TypeNameOrLeftOrRightOrExpression {
  type: string;
  name: string;
  range?: number[] | null;
}
export interface ParametersEntityOrVariablesEntityOrReturnParametersEntity {
  type: string;
  typeName: TypeNameOrLeftOrRightOrExpression;
  name: string;
  storageLocation?: null;
  isStateVar: boolean;
  isIndexed: boolean;
  range?: number[] | null;
}
export interface Body {
  type: string;
  statements?: StatementsEntity[] | null;
  range?: number[] | null;
}
export interface StatementsEntity {
  type: string;
  expression?: Expression | null;
  range?: number[] | null;
  variables?:
    | ParametersEntityOrVariablesEntityOrReturnParametersEntity1[]
    | null;
  initialValue?: InitialValue | null;
}
export interface Expression {
  type: string;
  operator?: string | null;
  left?: ExpressionOrRight | null;
  right?: ExpressionOrRight | null;
  range?: number[] | null;
  name?: string | null;
}
export interface TypeNameOrLeftOrRightOrExpression1 {
  type: string;
  name: string;
  range?: number[] | null;
}
export interface ExpressionOrRight {
  type: string;
  operator?: string | null;
  left?: TypeNameOrLeftOrRightOrExpression2 | null;
  right?: TypeNameOrLeftOrRightOrExpression3 | null;
  range?: number[] | null;
  name?: string | null;
}
export interface TypeNameOrLeftOrRightOrExpression2 {
  type: string;
  name: string;
  range?: number[] | null;
}
export interface TypeNameOrLeftOrRightOrExpression3 {
  type: string;
  name: string;
  range?: number[] | null;
}
export interface ParametersEntityOrVariablesEntityOrReturnParametersEntity1 {
  type: string;
  typeName: TypeNameOrLeftOrRightOrExpression;
  name: string;
  storageLocation?: null;
  isStateVar: boolean;
  isIndexed: boolean;
  range?: number[] | null;
}
export interface InitialValue {
  type: string;
  operator: string;
  left: TypeNameOrLeftOrRightOrExpression;
  right: Right;
  range?: number[] | null;
}
export interface Right {
  type: string;
  number: string;
  subdenomination?: null;
  range?: number[] | null;
}
export interface ReturnParametersEntity {
  type: string;
  typeName: TypeNameOrLeftOrRightOrExpression;
  name?: string | null;
  storageLocation?: null;
  isStateVar: boolean;
  isIndexed: boolean;
  range?: number[] | null;
}
