import { Inter } from "@next/font/google";
import {
  Box,
  ChakraProvider,
  extendTheme,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Sidebar from "@/components/navigation";
import { DefaultFlow } from "@/components/flows/defaultFlow";

const inter = Inter({ subsets: ["latin"] });

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
});

export default function Home() {
  return (
    <ChakraProvider theme={Theme}>
      <Main />
    </ChakraProvider>
  );
}

const Main = () => {
  // React.useEffect(() => {
  //   handleApiCall()
  // }, [])

  // const handleApiCall = async() => {
  //   const res = await axios.post('http://localhost:3000/api/hello')
  //   console.log(res)
  // }

  // const handleFileInputChange = async(e: any) => {
  //   let file = e.target.files[0]
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   const res = await axios.post('http://localhost:3000/api/hello')
  //   console.log(res)
  // }

  return (
    <Box h="100vh" w="100vw">
      <Sidebar />
      <Box h="100vh">
        <Flex
          w={{ base: "full", md: "calc(100vw - 300px)" }}
          ml="300px"
          bg="#1c1e2a"
        >
          <Tabs variant="unstyled">
            <TabList
              color="zinc.400"
              h="40px"
              borderBottomWidth="2px"
              borderColor="#34384e"
            >
              <Tab
                _selected={{
                  color: "white",
                  bg: "#34384e",
                  fontWeight: "medium",
                }}
                fontWeight="normal"
                fontSize="sm"
              >
                Bussin.sol
              </Tab>
              <Tab
                _selected={{
                  color: "white",
                  bg: "#34384e",
                  fontWeight: "medium",
                }}
                fontWeight="normal"
                fontSize="sm"
              >
                fx - addToOriginalNumber
              </Tab>
            </TabList>
            <TabPanels padding={0}>
              <TabPanel padding={0}>
                <DefaultFlow />
              </TabPanel>
              <TabPanel padding={0}>
                <DefaultFlow />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </Box>
  );
};
