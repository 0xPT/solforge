import { NodeElements } from "@/constants";
import { NodeTypes } from "@/types";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { InputType } from "zlib";
import { ContextMenu } from "../common/ContextMenu";

const initBgColor = "#000";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid: [number, number] = [20, 20];

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

export const DefaultFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "#fff" } }, eds)
      ),
    []
  );

  const onAddNode = (type: NodeTypes) => {
    switch (type) {
      case NodeTypes.FunctionNode: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: `Node ${nodes.length + 1}`,
            type,
            inputs: [
              {
                name: "bussin bussin",
                type: "banana",
              },
            ],
            outputs: [],
          },
          position: { x: 0, y: 0 },
          inputs: [
            {
              name: "bussin bussin",
              type: "banana",
            },
          ],
          outputs: [
            {
              name: "bussin bussin",
              type: "banana",
            },
          ],
        };
        setNodes((ns) => ns.concat(newNode));
        return;
      }
      case NodeTypes.VariableNode: {
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type,
          data: {
            label: `Node ${nodes.length + 1}`,
            type,
          },
          position: { x: 0, y: 0 },
        };
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

  console.log(nodes);

  return (
    <Flex
      onContextMenu={handleContextMenu}
      w={{
        base: "full",
        md: "calc(100vw - 100px)",
      }}
      ml={60}
      h="full"
    >
      <ContextMenu
        isOpen={contextMenuOpen}
        pos={pos}
        handleContextMenuClose={handleContextMenuClose}
        onAddNode={onAddNode}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ background: "rgb(39 39 42)" }}
        nodeTypes={NodeElements}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-center"
      >
        <Controls />
      </ReactFlow>
    </Flex>
  );
};
