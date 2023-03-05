import { Button, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { AiFillCode, AiOutlineDeploymentUnit } from "react-icons/ai";
import { DeployModal } from "./DeployModal";
import axios from "axios";
import { SrcCodeModal } from "./SrcModal";

const source = `pragma solidity 0.8.8;
contract TestContract {
	function testAddress() public returns (address) {
      address anAddress;

      anAddress = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

      return anAddress;
    }
}`;

export const BottomMenu = ({ isNavOpen }: { isNavOpen: boolean }) => {
  const [deplyOpen, setDeployOpen] = React.useState(false);
  const [srcOpen, setSrcOpen] = React.useState(false);
  const [deployLoading, setDeployLoading] = React.useState(false);
  const [deployHash, setDeployHash] = React.useState("");
  const [deployUrl, setDeployUrl] = React.useState("");

  const deployContract = async ({ network }) => {
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
        chainId = 5;
        networkName = "scroll";
        break;
    }

    const response = await axios.post("/api/deploy", {
      source,
      network: networkName,
      chainId: chainId,
      contractName: "TestContract",
    });

    // console.log(response.data.address);
    setDeployHash(response.data.address);
    setDeployUrl(`${etherscanUrl}${response.data.address}`);
    setDeployLoading(false);
  };

  const left = isNavOpen ? "calc(50% - 50px + 100px)" : "calc(50% - 50px)";

  return (
    <Flex
      bg="gray.900"
      justifyContent="space-around"
      zIndex={100}
      pos="absolute"
      bottom="24px"
      left={left}
      w="200px"
      borderRadius={24}
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
        source={source}
      />
      <Tooltip label="View source code">
        <IconButton
          onClick={() => setSrcOpen(true)}
          size="lg"
          bg="transparent"
          aria-label="View source code"
          icon={<AiFillCode />}
        />
      </Tooltip>
      <Tooltip label="Deploy Contract">
        <IconButton
          onClick={() => setDeployOpen(true)}
          size="lg"
          bg="transparent"
          aria-label="Deploy contract"
          icon={<AiOutlineDeploymentUnit />}
        />
      </Tooltip>
    </Flex>
  );
};
