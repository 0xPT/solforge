import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  Flex,
  FlexProps,
  Icon,
  Link,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

interface NavItemProps extends FlexProps {
  icon: IconType;
  collapsable?: boolean;
}

export const NavItem = ({
  icon,
  children,
  collapsable = true,
  ...rest
}: NavItemProps) => {
  if (!collapsable) {
    return (
      <Link href="#">
        <Flex
          flex={1}
          align="center"
          p="4"
          mx="4"
          role="group"
          cursor="pointer"
          border="none"
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    );
  } else
    return (
      <AccordionItem
        textDecor="none"
        ml="0 !important"
        border="none"
        _focus={{ boxShadow: "none" }}
      >
        <AccordionButton>
          <Flex
            flex={1}
            align="center"
            p="4"
            mr="4"
            role="group"
            cursor="pointer"
            border="none"
            {...rest}
          >
            {icon && (
              <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                  color: "white",
                }}
                as={icon}
              />
            )}
            {children}
          </Flex>
          <AccordionIcon />
        </AccordionButton>
      </AccordionItem>
    );
};
