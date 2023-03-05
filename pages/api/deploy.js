const ethers = require("ethers");
const solc = require("solc");
const dotenv = require("dotenv");

dotenv.config();

export default async function handler(req, res) {
  try {
    const { source, network, contractName, chainId } = req.body;

    let provider = null;

    if (network === "goerli") {
      provider = new ethers.JsonRpcProvider(
        `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      );
    } else if (network === "mumbai") {
      provider = new ethers.JsonRpcProvider(
        `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      );
    } else if (network === "zksync") {
      provider = new ethers.JsonRpcProvider("https://rinkeby.zksync.io/");
    } else if (network === "base-goerli") {
      provider = new ethers.JsonRpcProvider(
        `https://wispy-wiser-snowflake.base-goerli.discover.quiknode.pro/${process.env.QN_ID}/`
      );
    }

    const pk =
      network === "base-goerli"
        ? process.env.CB_PRIVATE_KEY
        : process.env.PRIVATE_KEY;

    const wallet = new ethers.Wallet(pk, provider);

    const fileName = `${contractName}.sol`;

    // Compile the Solidity file using solc
    const input = {
      language: "Solidity",
      sources: {
        [fileName]: {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    };
    const output = JSON.parse(
      solc.compile(JSON.stringify(input), { version: "0.8.8" })
    );

    console.log(output);

    // Get the compiled contract's ABI and bytecode
    const abi = output.contracts[fileName][contractName].abi;
    const bytecode =
      output.contracts[fileName][contractName].evm.bytecode.object;

    // Create an instance of the ContractFactory
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy the contract
    const contract = await factory.deploy({ chainId });
    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("Contract deployed to:", address);

    return res.status(200).json({
      address,
    });
  } catch (e) {
    console.log(e);
  }
  return res.status(200);
}
