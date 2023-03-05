import { Box, ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/navigation";
import { DefaultFlow } from "@/components/flows/defaultFlow";
import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { OutputProvider } from "../hooks/useOutput";

export const Theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors: {
    zinc: {
      50: "rgb(250 250 250)",
      100: "rgb(244 244 245)",
      200: "rgb(228 228 231)",
      300: "rgb(212 212 216)",
      400: "rgb(161 161 170)",
      500: "rgb(113 113 122)",
      600: "rgb(82 82 91)",
      700: "rgb(63 63 70)",
      800: "rgb(39 39 42)",
      900: "rgb(24 24 27)",
    },
  },
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          height: "16px",
          width: "16px",
          borderRadius: "4px",
          border: `1px solid rgba(255, 36, 0, 1) !important`,
          backgroundColor: "rgba(255, 36, 0, 0.5) !important",
          borderColor: "rgba(255, 36, 0, 1) !important",
          fontFeatureSettings: "'ss02' on",
          outline: "none !important",
          boxShadow: "none !important",
          _checked: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: "16px",
            width: "16px",
            borderRadius: "4px",
            border: `1px solid rgba(255, 36, 0, 1) !important`,
            backgroundColor: "rgba(255, 36, 0, 0.5) !important",
            borderColor: "rgba(255, 36, 0, 1) !important",
            fontFeatureSettings: "'ss02' on",
            color: "#ffffff !important",
            boxShadow: "none !important",
            outline: "none !important",
          },
        },
      },
    },
  },
});

export default function Home() {
  return (
    <ChakraProvider theme={Theme}>
      <Main />
    </ChakraProvider>
  );
}

const Main = () => {
  const [isOpen, setIsOpen] = useState(true);
  const reactFlowWidth = isOpen ? "calc(100vw - 300px)" : "calc(100vw - 100px)";

  return (
    <OutputProvider>
      <ReactFlowProvider>
        <Box h="100vh" w="100vw">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <Box h="100vh">
            <Flex
              w={{ base: "full", md: reactFlowWidth }}
              ml={isOpen ? "300px" : "100px"}
              bg="#1c1e2a"
            >
              <DefaultFlow isSideNavOpen={isOpen} />
            </Flex>
          </Box>
        </Box>
      </ReactFlowProvider>
    </OutputProvider>
  );
};
