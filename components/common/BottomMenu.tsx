// @ts-nocheck
import { Button, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  AiFillCode,
  AiOutlineCode,
  AiOutlineDeploymentUnit,
  AiOutlineExport,
  AiOutlineUpload,
} from "react-icons/ai";
import { DeployModal } from "./DeployModal";
import axios from "axios";
import { SrcCodeModal } from "./SrcModal";
import { convertNodesToAST } from "@/utils/FlowToAst";
import { ast_to_source } from "@/utils/CodeGen";
import { useOutput } from "@/hooks/useOutput";

export const BottomMenu = ({
  isNavOpen,
  nodes,
  edges,
  stateVariables,
}: {
  isNavOpen: boolean;
  nodes: any;
  edges: any;
  stateVariables: any;
}) => {
  const [deplyOpen, setDeployOpen] = React.useState(false);
  const [srcOpen, setSrcOpen] = React.useState(false);
  const [deployLoading, setDeployLoading] = React.useState(false);
  const [deployHash, setDeployHash] = React.useState("");
  const [deployUrl, setDeployUrl] = React.useState("");
  const [source, setSource] = React.useState("");

  const { output, setOutput } = useOutput();

  useEffect(() => {
    if (output) setSource(ast_to_source(output));
  }, [output]);

  const getSource = () => {
    const NodeAst = convertNodesToAST(nodes, edges, stateVariables);
    const sourceCode2 = ast_to_source(NodeAst);

    return sourceCode2;
  };

  const deployContract = async ({ network }) => {
    const NodeAst = convertNodesToAST(nodes, edges, stateVariables);
    const sourceCode2 = ast_to_source(NodeAst);

    setDeployLoading(true);
    let chainId;
    let networkName;
    let etherscanUrl;

    switch (network) {
      case "ethereum (l1)":
        chainId = 5;
        networkName = "goerli";
        etherscanUrl = "https://goerli.etherscan.io/address/";
        break;
      case "polygon (l1)":
        chainId = 80001;
        networkName = "mumbai";
        etherscanUrl = "https://mumbai.polygonscan.com/address/";
        break;
      case "zksync era (l2)":
        chainId = 280;
        networkName = "zksync";
        etherscanUrl = "https://rinkeby-explorer.zksync.io/address/";
        break;
      case "base (l2)":
        chainId = 84531;
        networkName = "base-goerli";
        etherscanUrl = "https://goerli.basescan.org/address/";
        break;
      case "scroll (l2)":
        chainId = 534353;
        networkName = "scroll";
        etherscanUrl = "https://blockscout.scroll.io/address/";
        break;
    }

    const response = await axios.post("/api/deploy", {
      source: sourceCode2,
      network: networkName,
      chainId: chainId,
      contractName: "Contract",
    });

    setDeployHash(response.data.address);
    setDeployUrl(`${etherscanUrl}${response.data.address}`);
    setDeployLoading(false);
  };

  const handleFileChange = async (e: any) => {
    let text;
    const file = e?.target?.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      text = e?.target?.result;
      const res = await axios.post("/api/upload", { text });
      setOutput(res.data);
    };
  };

  const left = isNavOpen ? "calc(50% - 50px + 100px)" : "calc(50% - 50px)";

  return (
    <Flex
      bg="#242736"
      padding="8px 16px"
      boxShadow="rgb(0 0 0 / 20%) 0px 0px 30px"
      borderRadius="48px"
      justifyContent="space-around"
      zIndex={100}
      pos="absolute"
      bottom="24px"
      left={left}
      w="200px"
    >
      <DeployModal
        isOpen={deplyOpen}
        onClose={() => {
          setDeployOpen(false);
          setDeployHash("");
          setDeployUrl("");
        }}
        deployContract={deployContract}
        deployHash={deployHash}
        deployUrl={deployUrl}
        deployLoading={deployLoading}
      />
      <SrcCodeModal
        isOpen={srcOpen}
        onClose={() => setSrcOpen(false)}
        getSource={getSource}
      />
      <Tooltip label="View source code" bg="transparent" color="#fff">
        <IconButton
          borderRadius="50%"
          onClick={() => setSrcOpen(true)}
          size="lg"
          bg="transparent"
          aria-label="View source code"
          icon={<AiOutlineCode />}
          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
        />
      </Tooltip>
      <Tooltip label="Upload source code" bg="transparent" color="#fff">
        <IconButton
          borderRadius="50%"
          onClick={() => document.getElementById("fileInput")?.click()}
          size="lg"
          bg="transparent"
          aria-label="View source code"
          icon={<AiOutlineUpload />}
          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
        />
      </Tooltip>
      <Tooltip label="Deploy contract" bg="transparent" color="#fff">
        <IconButton
          borderRadius="50%"
          onClick={() => setDeployOpen(true)}
          size="lg"
          bg="transparent"
          aria-label="Deploy contract"
          icon={<AiOutlineExport />}
          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
        />
      </Tooltip>
      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Flex>
  );
};
