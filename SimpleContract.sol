// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    string public message;
    uint256 public count;
    address public owner;
    bool public isActive;

    constructor(string memory _message) {
        message = _message;
        owner = msg.sender;
        isActive = true;
    }

    function setMessage(string memory _message) public {
        require(msg.sender == owner, "You are not the owner of the contract");
        message = _message;
    }

    function incrementCount() public {
        require(isActive == true, "The contract is not active");
        count = count + 1;
    }

    function setInactive() public {
        require(msg.sender == owner, "You are not the owner of the contract");
        isActive = false;
    }
}
