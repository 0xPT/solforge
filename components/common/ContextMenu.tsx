import { NodeMenuItems } from "@/constants";
import { useClickOutside } from "@/hooks/useClickOutside";
import { NodeTypes } from "@/types";
import { Menu, MenuList, MenuItem, Box } from "@chakra-ui/react";
import React, { useRef } from "react";

interface ContextMenuProps {
  pos: {
    top: number;
    left: number;
  };
  isOpen: boolean;
  handleContextMenuClose: () => void;
  onAddNode: (node: NodeTypes) => void;
}

export const ContextMenu = ({
  pos,
  isOpen,
  handleContextMenuClose,
  onAddNode,
}: ContextMenuProps) => {
  const contextMenuRef = useRef(null);
  useClickOutside(contextMenuRef, handleContextMenuClose);
  return (
    <Box ref={contextMenuRef} pos="absolute" top={pos.top} left={pos.left}>
      <Menu isOpen={isOpen} onClose={handleContextMenuClose}>
        <MenuList>
          {Object.entries(NodeMenuItems)?.map(([nodeType, item]) => (
            <MenuItem
              icon={<item.icon />}
              key={nodeType}
              onClick={() => onAddNode(nodeType as NodeTypes)}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
