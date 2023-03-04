// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Structure to store voter information
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    // Structure to store proposal information
    struct Proposal {
        string name;
        uint256 voteCount;
    }

    // Contract owner
    address public owner;

    // Mapping to store voter information
    mapping(address => Voter) public voters;
    
    uint256[] public ids;

    // Array to store proposal information
    Proposal[] public proposals;

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Function to register as a voter
    function registerVoter() public {
        require(voters[msg.sender].isRegistered == false, "You are already registered as a voter");

        voters[msg.sender].isRegistered = true;
        voters[msg.sender].hasVoted = false;
        voters[msg.sender].votedProposalId = 0;
    }

    // Function to vote for a proposal
    function vote(uint256 proposalId) public {
        require(voters[msg.sender].isRegistered == true, "You are not registered as a voter");
        require(voters[msg.sender].hasVoted == false, "You have already voted");
        require(proposalId < proposals.length, "Invalid proposal id");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;
        proposals[proposalId].voteCount = proposals[proposalId].voteCount + 1;
    }


    // Function to add a new proposal (owner only)
    function addProposal(string memory proposalName) public {
        proposals.push(Proposal({
            name: proposalName,
            voteCount: 0
        }));
    }
}
