// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title DemoORTToken
 * @notice Token de práctica para la Clase 15; usar únicamente en Sepolia.
 * @dev decimals() es 0 para operar con cantidades enteras en las demos.
 */
contract DemoORTToken is ERC20 {
    constructor() ERC20("Demo ORT Token", "DORT") {
        // Los 1000 tokens iniciales quedan en la cuenta que despliega.
        _mint(msg.sender, 1000);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }
}
