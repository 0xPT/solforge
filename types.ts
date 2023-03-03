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

export interface IDataHandle {
  id: string;
  label: string;
  type: EDataType;
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

export enum ENodeType {
  VARIABLE_NODE = "VARIABLE_NODE",
  FUNCTION_NODE = "FUNCTION_NODE",
  OPERATION_NODE = "OPERATION_NODE",
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
