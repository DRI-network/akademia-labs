pragma solidity ^0.4.23;

contract Color_V1 {
    struct RGB {
        uint r;
        uint g;
        uint b;
    }
    mapping (address => RGB) colors;

    event NewColor(address indexed sender, uint r, uint g, uint b);

    function setMyColor(uint _r, uint _g, uint _b) public {
        require(_b < 256);
        colors[msg.sender] = RGB(_r, _g, _b);
        emit NewColor(msg.sender, _r, _g, _b);
    }

    function getColor(address _address) public view returns (uint, uint, uint) {
        return (colors[_address].r, colors[_address].g, colors[_address].b);
    }
}