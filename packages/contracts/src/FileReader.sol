// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";

library FileReader {
    function readBytes(uint256 size, address[] memory pointers)
        public
        view
        returns (bytes memory data)
    {
        data = DynamicBuffer.allocate(size);
        for (uint256 i = 0; i < pointers.length; i++) {
            DynamicBuffer.appendSafe(data, SSTORE2.read(pointers[i]));
        }
        return data;
    }

    function readBytes(address[] memory pointers)
        public
        view
        returns (bytes memory data)
    {
        uint256 size = 0;
        for (uint256 i = 0; i < pointers.length; i++) {
            size += Bytecode.codeSize(pointers[i]) - 1;
        }
        data = DynamicBuffer.allocate(size);
        for (uint256 i = 0; i < pointers.length; i++) {
            DynamicBuffer.appendSafe(data, SSTORE2.read(pointers[i]));
        }
    }
}
