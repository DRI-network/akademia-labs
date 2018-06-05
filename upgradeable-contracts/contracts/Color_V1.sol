pragma solidity ^0.4.23;

contract Color_V1 {
    uint public r;
    uint public g;
    uint public b;

    event NewColor(address indexed donor, uint r, uint g, uint b);

    function setColor(uint _r, uint _g, uint _b) public {
        r = _r;
        g = _g;
        b = _b;
        emit NewColor(msg.sender, r, g, b);
    }

    function getR() public view returns (uint) {
        return r;
    }
}