// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {SSTORE2} from "solady/utils/SSTORE2.sol";

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

/**
 * @notice Reverts the transaction using the provided raw bytes as the revert reason
 * @dev Uses assembly to perform the revert operation with the raw bytes
 * @param reason The raw bytes revert reason
 */
function revertWithBytes(bytes memory reason) pure {
    assembly {
        // reason+32 is a pointer to the error message, mload(reason) is the length of the error message
        revert(add(reason, 0x20), mload(reason))
    }
}

/**
 * @dev Checks if the given address points to a valid SSTORE2 data contract (i.e. starts with STOP opcode)
 * @param pointer The address to be checked
 * @return isValid true if the address points to a valid contract (bytecode starts with a STOP opcode), false otherwise
 */
function isValidPointer(address pointer) view returns (bool isValid) {
    // The assembly below is equivalent to
    //
    //   pointer.code.length >= 1 && pointer.code[0] == 0x00;
    //
    // but less gas because it doesn't have to load all the pointer's bytecode

    assembly {
        // Get the size of the bytecode at pointer
        let size := extcodesize(pointer)

        // Initialize first byte with INVALID opcode
        let firstByte := 0xfe

        // If there's at least one byte of code, copy the first byte
        if gt(size, 0) {
            // Allocate memory for the first byte
            let code := mload(0x40)

            // Copy the first byte of the code
            extcodecopy(pointer, code, 0, 1)

            // Retrieve the first byte, ensuring it's a single byte
            firstByte := and(mload(sub(code, 31)), 0xff)
        }

        // Check if the first byte is 0x00 (STOP opcode)
        isValid := eq(firstByte, 0x00)
    }
}
