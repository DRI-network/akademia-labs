pragma solidity ^0.4.23;

import "./Color_V1.sol";

contract Color_V2 is Color_V1 {
    function setColor(uint _r, uint _g, uint _b) public {
        require(_r < 256);
        require(_g < 256);
        require(_b < 256);
        colors[msg.sender] = RGB(_r, _g, _b);
        emit NewColor(msg.sender, _r, _g, _b);
    }
}