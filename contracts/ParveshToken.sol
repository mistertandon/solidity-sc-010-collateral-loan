// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ParveshToken is ERC20("Parvesh", "PARI") {
    constructor(uint256 initialSupply) {
        _mint(msg.sender, initialSupply);
    }
}