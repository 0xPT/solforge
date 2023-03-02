import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Box, ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/navigation";
import { DefaultFlow } from "@/components/flows/defaultFlow";

const inter = Inter({ subsets: ["latin"] });

export const Theme = extendTheme({
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
      <DefaultFlow />
    </Box>
  );
};
