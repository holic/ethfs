// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {revertWithBytes} from "./revertWithBytes.sol";

bytes32 constant SALT = bytes32("EthFS");

/**
 * @dev Error thrown when the pointer of the content added does not match the one we compute from the content, signaling something weird going on with the deployer
 * @param expectedPointer The expected address of the content
 * @param actualPointer The actual address of the content
 */
error UnexpectedPointer(address expectedPointer, address actualPointer);

/**
 * @dev Converts data into creation code for an SSTORE2 data contract
 * @param content The bytes content to be converted
 * @return creationCode The creation code for the data contract
 */
function contentToInitCode(
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

/**
 * @dev Predicts the address of a data contract based on its content
 * @param deployer The deployer's address
 * @param content The content of the data contract
 * @return pointer The predicted address of the data contract
 */
function getPointer(
    address deployer,
    bytes memory content
) pure returns (address pointer) {
    return SSTORE2.predictDeterministicAddress(content, SALT, deployer);
}

/**
 * @dev Checks if a pointer (data contract address) already exists
 * @param pointer The data contract address to check
 * @return true if the data contract exists, false otherwise
 */
function pointerExists(address pointer) view returns (bool) {
    return pointer.code.length > 0;
}

/**
 * @dev Adds content as a data contract using a deterministic deployer
 * @param deployer The deployer's address
 * @param content The content to be added as a data contract
 * @return pointer The address of the data contract
 */
function addContent(
    address deployer,
    bytes memory content
) returns (address pointer) {
    address expectedPointer = getPointer(deployer, content);
    if (pointerExists(expectedPointer)) {
        return expectedPointer;
    }

    (bool success, bytes memory data) = deployer.call(
        abi.encodePacked(SALT, contentToInitCode(content))
    );
    if (!success) revertWithBytes(data);

    pointer = address(uint160(bytes20(data)));
    if (pointer != expectedPointer) {
        revert UnexpectedPointer(expectedPointer, pointer);
    }
}
