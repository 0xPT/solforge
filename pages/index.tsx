import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/navigation";
import { DefaultFlow } from "@/components/flows/defaultFlow";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <ChakraProvider>
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
