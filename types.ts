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
  VariableNode = "VARIABLE_NODE",
  FunctionNode = "FUNCTION_NODE",
  EventNode = "EVENT_NODE",
}
