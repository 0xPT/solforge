import { EDataType, EFunctionType, ENodeType, EOperationType } from "@/types";
import { getEdgeColor } from "@/utils";

export const exampleNodes = [
  {
    id: `node/function-start`,
    type: ENodeType.FUNCTION_NODE,
    data: {
      label: `Add to Amount Added`,
      type: ENodeType.FUNCTION_NODE,
      operation: EFunctionType.START,
      inputs: [],
      outputs: [
        {
          id: "node/function-start/execute",
          type: EDataType.EXECUTE,
          label: "Execute",
        },
        {
          id: "node/function-start/number-to-add",
          type: EDataType.UINT_256,
          label: "Number to Add",
        },
      ],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: `node/function-end`,
    type: ENodeType.FUNCTION_NODE,
    data: {
      label: `Return Node`,
      type: ENodeType.FUNCTION_NODE,
      operation: EFunctionType.END,
      inputs: [
        {
          id: "node/function-end/input/execute",
          type: EDataType.EXECUTE,
          label: "",
        },
        {
          id: "node/function-end/input/new-total",
          type: EDataType.UINT_256,
          label: "New Total",
        },
      ],
      outputs: [],
    },
    position: { x: 1250, y: 0 },
  },
  {
    id: "node/variable/total-number",
    type: ENodeType.VARIABLE_NODE,
    data: {
      label: "Total Number",
      type: ENodeType.VARIABLE_NODE,
      operation: EDataType.UINT_256,
      inputs: [],
      outputs: [
        {
          id: "node/variable/output-total-number",
          type: EDataType.UINT_256,
          label: "Total Number",
        },
      ],
    },
    position: { x: 0, y: 500 },
  },
  {
    id: "node/operation/add",
    type: ENodeType.OPERATION_NODE,
    data: {
      label: "Addition",
      type: ENodeType.OPERATION_NODE,
      operation: EOperationType.ADDITION,
      inputs: [
        {
          id: "node/operation/add/input/number-to-add",
          type: EDataType.UINT_256,
          label: "",
        },
        {
          id: "node/operation/add/input/total-number",
          type: EDataType.UINT_256,
          label: "",
        },
      ],
      outputs: [
        {
          id: "node/operation/add/output/number-to-add-plus-total-number",
          type: EDataType.UINT_256,
          label: "",
        },
      ],
    },
    position: { x: 500, y: 250 },
  },
  {
    id: "node/expression/set",
    type: ENodeType.EXPRESSION_NODE,
    data: {
      label: "Set",
      type: ENodeType.EXPRESSION_NODE,
      inputs: [
        {
          id: "node/expression/set/input/execute",
          type: EDataType.EXECUTE,
          label: "",
        },
        {
          id: "node/expression/set/input/old-plus-new",
          type: EDataType.UINT_256,
          label: "Old Plus New",
        },
      ],
      outputs: [
        {
          id: "node/expression/set/output/execute",
          type: EDataType.EXECUTE,
          label: "",
        },
      ],
    },
    position: { x: 750, y: 0 },
  },
];

export const exampleEdges = [
  {
    source: "node/variable/total-number",
    sourceHandle: "output",
    target: "node/operation/add",
    targetHandle: "second-number",
    id: "reactflow__edge-node/variable/total-numberoutput-node/operation/addsecond-number",
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.UINT_256) },
  },
  {
    source: "node/function-start",
    sourceHandle: "output",
    target: "node/operation/add",
    targetHandle: "first-number",
    id: "reactflow__edge-node/function-startoutput-node/operation/addfirst-number",
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.UINT_256) },
  },
  {
    source: "node/function-start",
    sourceHandle: "execute",
    target: "node/expression/set",
    targetHandle: "execute",
    id: "reactflow__edge-node/function-startexecute-node/expression/setexecute",
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.EXECUTE) },
  },
  {
    source: "node/operation/add",
    sourceHandle: "output",
    target: "node/expression/set",
    targetHandle: "old-plus-new",
    id: "reactflow__edge-node/operation/addoutput-node/expression/setold-plus-new",
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.UINT_256) },
  },
  {
    source: "node/expression/set",
    sourceHandle: "execute",
    target: "node/function-end",
    targetHandle: "execute",
    id: "reactflow__edge-node/expression/setexecute-node/function-endexecute",
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.EXECUTE) },
  },
  {
    source: "node/expression/set",
    sourceHandle: "old-plus-new",
    target: "node/function-end",
    targetHandle: "output",
    id: "reactflow__edge-node/expression/setold-plus-new-node/function-endoutput",
    type: "smoothstep",
    style: { stroke: getEdgeColor(EDataType.UINT_256) },
  },
];

// green - #2ECC40
// blue - #0074D9
// purple - #A463F2
// red - #FF4136
// orange - #FF851B
// yellow - #FFDC00
// pink - #FF69B4

// export const exampleEdges = [
//   {
//     id: "edge-node/function-start/execute-node/expression/set/input/execute",
//     source: "node/function-start/execute",
//     sourceHandle: "node/function-start/inputs/execute",
//     target: "node/expression/set/input/execute",
//     targetHandle: "node/expression/set/inputs/execute",
//   },
//   {
//     id: "edge node/function-start/number-to-add -> node/operation/add/input/number-to-add",
//     source: "node/function-start/number-to-add",
//     target: "node/operation/add/input/number-to-add",
//   },
//   {
//     id: "edge node/variable/output-total-number -> node/operation/add/input/total-number",
//     source: "node/variable/output-total-number",
//     target: "node/operation/add/input/total-number",
//   },
//   {
//     id: "edge node/operation/add/output/number-to-add-plus-total-number -> node/expression/set/input/old-plus-new",
//     source: "node/operation/add/output/number-to-add-plus-total-number",
//     target: "node/expression/set/input/old-plus-new",
//   },
//   {
//     id: "edge node/expression/set/output/execute -> node/function-end/input/execute",
//     source: "node/expression/set/output/execute",
//     target: "node/function-end/input/execute",
//   },
//   {
//     id: "edge node/expression/set/output/execute -> node/function-end/input/new-total",
//     source: "node/expression/set/output/execute",
//     target: "node/function-end/input/new-total",
//   },
// ];
