import { AiOutlineFunction } from "react-icons/ai";
import { HiVariable } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { IconType } from "react-icons";
import { NodeTypes } from "./types";
import { VariableNode } from "./components/nodes/Variable";

type NodeMenuItem = {
  [key in NodeTypes]: {
    label: string;
    icon: IconType;
  };
};

const NodeMenuItems: NodeMenuItem = {
  [NodeTypes.VariableNode]: {
    label: "Add a variable",
    icon: HiVariable,
  },
  [NodeTypes.FunctionNode]: {
    label: "Add a function",
    icon: AiOutlineFunction,
  },
  [NodeTypes.EventNode]: {
    label: "Add an event",
    icon: GrTransaction,
  },
};

const NodeElements = {
  [NodeTypes.VariableNode]: VariableNode,
  [NodeTypes.FunctionNode]: VariableNode,
  [NodeTypes.EventNode]: VariableNode,
};

export { NodeMenuItems, NodeElements };
