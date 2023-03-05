import { NodeElements } from "@/constants";
import {
  EFunctionType,
  ENodeType,
  EOperationType,
  IReactFlowEdge,
  IReactFlowNode,
} from "@/types";
import { traverseAST } from "@/utils/Traverse";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Position,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { ContextMenu } from "../common/ContextMenu";
import CustomEdge from "./CustomEdge";
import { exampleNodes, exampleEdges } from "./examples/AddToAmountAdded";
import output from "@/output.json";
import { DeployModal } from "../DeployModal";
import axios from "axios";
import { convertNodesToAST } from "@/utils/FlowToAst";
import { ast_to_source } from "@/utils/CodeGen";

const initBgColor = "#000";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid: [number, number] = [20, 20];

const defaultViewport = { x: 0, y: 0, zoom: 5 };

const source = `pragma solidity 0.8.8;
contract TestContract {
	function testAddress() public returns (address) {
      address anAddress;

      anAddress = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

      return anAddress;
    }
}`;

// Set the initial node id for dragged elements.
let id = 0;
const getId = () => `dndnode_${id++}`;

export const DefaultFlow = () => {
  // @ts-ignore
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const flowRef = useRef<any>(null);
  const [flowInstance, setFlowInstance] = useState<any>(null);

  useEffect(() => {
    const traversedAST = traverseAST(output as any);
    const sourceCode = ast_to_source(output);

    setNodes(
      traversedAST.nodes.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            updateNode: (data: any) => getUpdateNodeFunction(node, data),
          },
        };
      })
    );
    setEdges(traversedAST.edges);

    const NodeAst = convertNodesToAST(
      traversedAST.nodes as unknown as IReactFlowNode[],
      traversedAST.edges as IReactFlowEdge[],
      traversedAST.stateVariables
    );
    console.log(NodeAst);
    console.log(traversedAST.stateVariables);

    const sourceCode2 = ast_to_source(NodeAst);
    console.log(sourceCode2);
  }, []);

  const getUpdateNodeFunction = (node: any, data: any) => {
    setNodes((nodes) => {
      return nodes.map((n) => {
        if (n.id === node.id) {
          const newNode = {
            ...n,
            data: {
              ...data,
            },
          };
          return newNode;
        }
        return n;
      });
    });
  };

  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onAddNode = (
    type: ENodeType,
    additional?: EOperationType | EFunctionType | any
  ) => {
    switch (type) {
      case ENodeType.FUNCTION_NODE: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: additional === EFunctionType.START ? "Start" : "End",
            type,
            operation: additional,
          },
          position: { x: 0, y: 0 },
        };
        // case ENodeType.FUNCTION_NODE: {
        //   const newNode = {
        //     id: `node-${nodes.length + 1}`,
        //     type,
        //     data: {
        //       label: `Node ${nodes.length + 1}`,
        //       type,
        //       inputs: [
        //         {
        //           name: "bussin bussin",
        //           type: "uint256",
        //         },
        //         {
        //           name: "bussin bussin",
        //           type: "address",
        //         },
        //         {
        //           name: "bussin bussin",
        //           type: "struct",
        //         },
        //       ],
        //       outputs: [],
        //     },
        //     position: { x: 0, y: 0 },
        //   };
        //   setNodes((ns) => ns.concat(newNode));
        //   return;
        // }
        // @ts-ignore
        setNodes((ns) => ns.concat(newNode));
        break;
      }
      case ENodeType.EXPRESSION_NODE: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: "Set",
            type,
            value: additional.value,
          },
          position: { x: 0, y: 0 },
        };
        // @ts-ignore
        setNodes((ns) => ns.concat(newNode));
        break;
      }
      case ENodeType.VARIABLE_NODE: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: `Node ${nodes.length + 1}`,
            type,
          },
          position: { x: 0, y: 0 },
        };
        // @ts-ignore
        setNodes((ns) => ns.concat(newNode));
        break;
      }
      case ENodeType.OPERATION_NODE: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: `Node ${nodes.length + 1}`,
            type,
            operation: additional,
          },
          position: { x: 0, y: 0 },
        };
        // @ts-ignore
        setNodes((ns) => ns.concat(newNode));
        break;
      }
      case ENodeType.COMPARISON_NODE: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: `Node ${nodes.length + 1}`,
            type,
            operation: additional,
          },
          position: { x: 0, y: 0 },
        };
        // @ts-ignore
        setNodes((ns) => ns.concat(newNode));
        break;
      }
    }
  };

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setContextMenuOpen(true);
    setPos({ left: e.pageX, top: e.pageY });
  };

  const handleContextMenuClose = () => {
    setContextMenuOpen(false);
  };

  useEffect(() => {
    const listener = (event: any) => {
      if (event.target.className == "react-flow__pane") {
        event.preventDefault();
        setContextMenuOpen(false);
      }
    };

    document.addEventListener("click", listener);
  }, []);

  const edgeTypes = {
    custom: CustomEdge,
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: any) => {
    event.preventDefault();
    const reactFlowBounds = flowRef.current.getBoundingClientRect();
    const type: ENodeType = event.dataTransfer.getData("node-type");
    const label: string = event.dataTransfer.getData("node-label");

    // check if the dropped element is valid
    if (typeof type === "undefined" || !type || !reactFlowBounds) {
      return;
    }

    const position = flowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: getId(),
      position,
      type,
      data: { label, type, inputs: [], outputs: [] },
    };
    setNodes((ns) => ns.concat(newNode as any));
  };
  // console.log(nodes);
  // console.log(edges);

  const deployContract = async () => {
    const response = await axios.post("/api/deploy", {
      source,
      network: "goerli",
      chainId: "5",
      contractName: "TestContract",
    });

    // console.log(response.data.address);
  };

  return (
    <Flex
      onContextMenu={handleContextMenu}
      w="full"
      h={{
        base: "full",
        md: "calc(100vh - 40px)",
      }}
    >
      <ContextMenu
        isOpen={contextMenuOpen}
        pos={pos}
        handleContextMenuClose={handleContextMenuClose}
        onAddNode={onAddNode}
      />
      <DeployModal
        isOpen={isOpen}
        onClose={onClose}
        deployContract={deployContract}
      />
      <Button
        onClick={onOpen}
        position="absolute"
        bottom="0"
        right="0"
        zIndex={99999}
      >
        Open Modal
      </Button>

      <ReactFlow
        onInit={setFlowInstance}
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        onDragOver={onDragOver}
        onDrop={onDrop}
        // @ts-ignore
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ background: "#1C1E2A" }}
        nodeTypes={NodeElements}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        panOnScroll
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        maxZoom={30}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </Flex>
  );
};
