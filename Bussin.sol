pragma solidity 0.8.8;

contract Bussin {
    uint256 totalNumber;
    
    function subtractFromAmountAdded(uint256 numberToSubtract) public returns (uint256 newTotal) {
    	uint256 oldMinusNew;
        oldMinusNew = totalNumber - numberToSubtract;
        
        return oldMinusNew;
    }

    // function addToAmountAdded(uint256 numberToAdd) public returns (uint256 newTotal) {
    //     uint256 oldPlusNew;
    //     oldPlusNew = totalNumber + numberToAdd;

    //     return oldPlusNew;
    // }
    
    // function testString() public returns (string memory) {
    // 	string memory aString = 'yo';
        
    //     aString = 'what up';
        
    //     return aString;
    // }

    // function testAddress() public returns (address) {
    // 	address anAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        
    //     anAddress = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        
    //     return anAddress;
    // }

    // function testBool() public returns (bool) {
    // 	bool aBool = true;
        
    //     aBool = false;
        
    //     return aBool;
    // }

    // function testArray() public returns (uint256[] memory) {
    // 	uint256[] memory anArray = new uint256[](3);
        
    //     anArray[0] = 1;
    //     anArray[1] = 2;
    //     anArray[2] = 3;
        
    //     return anArray;
    // }

    // function testMapping() public returns (uint256) {
    // 	mapping (uint256 => uint256) memory aMapping;
        
    //     aMapping[1] = 1;
    //     aMapping[2] = 2;
    //     aMapping[3] = 3;
        
    //     return aMapping[1];
    // }
}
