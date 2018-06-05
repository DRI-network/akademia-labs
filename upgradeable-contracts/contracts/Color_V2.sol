pragma solidity ^0.4.23;

import "./Color_V1.sol";

contract Color_V2 is Color_V1 {
    function setColor(uint _r, uint _g, uint _b) public {
        require(_r < 256);
        require(_g < 256);
        require(_b < 256);
        r = _r;
        g = _g;
        b = _b;
        emit NewColor(msg.sender, r, g, b);
    }
}