import {
  BoxProps,
  Box,
  useColorModeValue,
  Flex,
  CloseButton,
  Text,
  Divider,
  Accordion,
} from "@chakra-ui/react";
import { NavItem } from "./NavItem";
import { IconType } from "react-icons";

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
  linkItems: {
    name: string;
    icon: IconType;
    collapsable?: boolean;
  }[];
}

export const SidebarContent = ({
  onClose,
  linkItems,
  ...rest
}: SidebarContentProps) => {
  return (
    <Box
      transition="3s ease"
      bg={"#08080b"}
      borderRight="1px"
      borderRightColor={"zinc.800"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          SolForge
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {linkItems.map((link, index) => (
        <Accordion allowToggle>
          {index === 0 ? (
            <>
              <NavItem
                key={link.name}
                icon={link.icon}
                collapsable={link.collapsable}
              >
                {link.name}
              </NavItem>
              <Divider />
            </>
          ) : (
            <NavItem key={link.name} icon={link.icon}>
              {link.name}
            </NavItem>
          )}
        </Accordion>
      ))}
    </Box>
  );
};
