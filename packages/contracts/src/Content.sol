// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {revertWithBytes} from "./revertWithBytes.sol";

bytes32 constant SALT = bytes32(0);

/// @dev Error thrown when the pointer of the content added does not match the one we compute from the content, signaling something weird going on with the deployer
/// @param expectedPointer The expected address of the content
/// @param actualPointer The actual address of the content
error UnexpectedPointer(address expectedPointer, address actualPointer);

function contentToCreationCode(
    bytes memory content
) pure returns (bytes memory creationCode) {
    // Use the same strategy as Solady's SSTORE2 to write a data contract, but do this via the deployer for a constant address
    // https://github.com/Vectorized/solady/blob/cb801a60f8319a148697b09d19b748d04e3d65c4/src/utils/SSTORE2.sol#L44-L59
    // TODO: convert this to assembly?
    return
        abi.encodePacked(
            bytes11(0x61000080600a3d393df300) |
                // Overlay content size (plus offset for STOP opcode) into second and third bytes
                bytes11(bytes3(uint24(content.length + 1))),
            content
        );
}

function getPointer(
    address deployer,
    bytes memory content
) pure returns (address pointer) {
    return SSTORE2.predictDeterministicAddress(content, SALT, deployer);
}

function pointerExists(address pointer) view returns (bool) {
    return pointer.code.length > 0;
}

function addContent(
    address deployer,
    bytes memory content
) returns (address pointer) {
    address expectedPointer = getPointer(deployer, content);
    if (pointerExists(expectedPointer)) {
        return expectedPointer;
    }

    (bool success, bytes memory data) = deployer.call(
        abi.encodePacked(SALT, contentToCreationCode(content))
    );
    if (!success) revertWithBytes(data);

    pointer = address(uint160(bytes20(data)));
    if (pointer != expectedPointer) {
        revert UnexpectedPointer(expectedPointer, pointer);
    }
}
