// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @notice Retrieves the size of the contract's bytecode at a specified address
/// @param target The address of the contract
/// @return size The size of the contract's bytecode at the given address, in bytes
function getCodeSize(address target) view returns (uint32 size) {
    assembly {
        size := extcodesize(target)
    }
}
