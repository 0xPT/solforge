import React, { ReactElement, ReactNode } from "react";
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiHome,
} from "react-icons/fi";
import { AiOutlineFunction } from "react-icons/ai";
import { IconType } from "react-icons";
import { MobileNav } from "./MobileNav";
import { SidebarContent } from "./SidebarContent";

interface LinkItemProps {
  name: string;
  icon: IconType;
  collapsable?: boolean;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, collapsable: false },
  { name: "Functions", icon: AiOutlineFunction },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      pos="fixed"
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      zIndex={1}
    >
      <SidebarContent
        linkItems={LinkItems}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} linkItems={LinkItems} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
    </Box>
  );
}
