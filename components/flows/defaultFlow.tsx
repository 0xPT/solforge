import { NodeElements } from "@/constants";
import { EFunctionType, ENodeType, EOperationType } from "@/types";
import { traverseAST } from "@/utils/Traverse";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
} from "reactflow";
import "reactflow/dist/style.css";
import { ContextMenu } from "../common/ContextMenu";
import CustomEdge from "./CustomEdge";
import { exampleNodes, exampleEdges } from "./examples/AddToAmountAdded";
import output from "@/output.json";

const initBgColor = "#000";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid: [number, number] = [20, 20];

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

export const DefaultFlow = () => {
  // @ts-ignore
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const flowRef = useRef<any>(null);

  useEffect(() => {
    const traversedAST = traverseAST(output);

    setNodes(traversedAST.nodes);
    setEdges(traversedAST.edges);
  }, []);

  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onAddNode = (
    type: ENodeType,
    additional?: EOperationType | EFunctionType
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

  return (
    <Flex
      onContextMenu={handleContextMenu}
      w={{
        base: "full",
        md: "calc(100vw - 300px)",
      }}
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
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
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
        fitView
        attributionPosition="bottom-center"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </Flex>
  );
};
