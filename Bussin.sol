pragma solidity 0.8.8;

contract Bussin {
    uint256 public originalNumber;
    uint256 private additionalMath;

    constructor(uint256 _originalNumber) {
        originalNumber = _originalNumber;
    }

    function getOriginalNumber() public view returns (uint256) {
        return originalNumber;
    }

    function getTotalNumber() public view returns (uint256) {
        return originalNumber + additionalMath;
    }

    function addMore() public {
        additionalMath += 1;
    }
}