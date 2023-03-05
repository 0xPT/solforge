![Logo](https://solforge.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsolforge.20b52fcb.png&w=384&q=75)

## Vision

We believe that a visual scripter for Solidity enables distinguished engineers to build more complex systems on Ethereum and helps onboard less technical individuals into smart contracts, ultimately leading to more mainstream adoption of blockchain technology.

## Overview

Solforge is a visual scripter for solidity that allows both engineers and non-engineers to more easily understand smart contracts. For engineers, this tool allows you to import any smart contract and visualize the data flow in a more easy to consume, no-code format. Engineers can also use this tool to build smart contracts from scratch and easily deploy them to chains like Ethereum, zkSync, Scroll, Polygon, and Base. For non-engineers, this tool abstracts away syntax from codebases to allow people like DeFi traders and product managers to better understand how money or data is being used in a smart contract system (i.e., DeFi AMM or money market).

## Team

- Cayman Jeffers - Cayman is a founder & full-stack engineer that's currently working in Web2 and branching out into Web3.
- Paul Thomas - Paul is a founder & full-stack engineer focused on building Web3 products that can attain mainstream adoption.
- Casper Yonel - Casper is a founder & ex. Wall Street banker, and software engineer focused on building DeFi applications.

## Problems Solforge aims to solve

- Difficult for non-engineers to understand smart contracts
- Difficult to understand the data flow of complex systems in Solidity
- Can be daunting for devs to learn a new language

## The future of Solforge

Unfortunately, we couldn't build everything we wanted to build. Some other things we would like to have added include:

- Easily integrate other third-party libraries, like Chainlink Oracles or Optimism's AttestationStation
- Quickly add upgradability and time-locks by changing settings
- Automatically display possible security vulnerabilities and recommendations to fix them
- Automatic gas optimization techniques
- Deploy & manage deployed contracts in one central place
- More robust system for nodes, including internal functions and modifiers
- Other languages

## How we built it

We were inspired by Blueprints in Unreal Engine, and thought that it would be useful to have a similar tool for Solidity. The main flow of the project was this: Solidity -> AST -> React Flow -> AST -> Solidity. We spent a good amount of time just parsing and converting code into different formats.

# Challenges we faced

- Converting a visual graph back into an AST, and then into source code is a very complex task that presented some challenges
- Converting an AST into a visual graph was also slightly challenging
- Deploying on base was somewhat difficult without Hardhat
- Deploying on zksync without a Hardhat library blocked us from deploying on zkSync

## Bounty Information

We chose to give users the choice of which chain they would like to deploy on. All of the links for the deployments can be seen in the demo.

Polygon (Mumbai) Deployment - https://mumbai.polygonscan.com/address/0xa4489a202911557e54E987dBaDAE8115cDA15913
Base (Testnet) Deployment - https://goerli.basescan.org/address/0x71bC6dE53CFFDdb49693442B3cBa1645993C7e0A
Scroll (Testnet) Deployment - https://blockscout.scroll.io/address/0x77552BACCbA6E8De17885484351Ce3D31b4D1E92
zkSync (Testnet) Deployment - Couldn't get deployment working :(

We recommend Polygon, Base, Scroll, and zkSync because:

1. They are all compatible with the Ethereum Virtual Machine, allowing developers to use existing Ethereum tools and infrastructure to build on them.

2. They all offer high throughput and faster transaction times than Ethereum, making them more scalable and better suited to handle high volumes of transactions.

3. They all offer significantly lower transaction fees than Ethereum, making them more cost-effective to build and deploy applications on the platform.

4. They are interoperable with other blockchains, making it easy to integrate with other networks and build more complex and innovative applications.
