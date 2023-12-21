// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "./IContentStore.sol";
import {revertWithBytes} from "./revertWithBytes.sol";
import {Deployed} from "./common.sol";

/// @title EthFS ContentStore
/// @notice Content-addressable, immutable bytes storage for Ethereum. Using SSTORE2 and Safe's Singleton Factory, content is written to its content-derived deterministic address.
contract ContentStore is IContentStore {
    /// @dev Address of the deployer (aka singleton factory), used for creating contracts at deterministic addresses
    address internal immutable deployer;
    /// @dev Salt used by deployer in CREATE2 opcode
    bytes32 internal constant salt = bytes32(0);

    /// @notice Constructor sets the deployer address
    /// @param _deployer The address of the deployer
    constructor(address _deployer) {
        deployer = _deployer;
        emit Deployed();
    }

    /// @notice Checks if content exists at a given pointer address
    /// @param pointer The address of the content
    /// @return True if content exists, false otherwise
    function pointerExists(address pointer) public view returns (bool) {
        return pointer.code.length > 0;
    }

    /// @notice Get the length of the content stored at a specific pointer
    /// @param pointer The address of the content
    /// @return size The size of the content in bytes
    function contentLength(address pointer) public view returns (uint32 size) {
        size = uint32(pointer.code.length);
        if (size == 0) {
            revert ContentNotFound(pointer);
        }
        return size - uint32(SSTORE2.DATA_OFFSET);
    }

    /// @notice Computes the deterministic pointer for given content
    /// @param content The content to compute the address for
    /// @return pointer The computed address of the content
    function getPointer(
        bytes memory content
    ) public view returns (address pointer) {
        return SSTORE2.predictDeterministicAddress(content, salt, deployer);
    }

    /// @notice Store content and return its address pointer
    /// @param content The content to store
    /// @return pointer The address where the content is stored
    function addContent(bytes memory content) public returns (address pointer) {
        address expectedPointer = getPointer(content);
        if (pointerExists(expectedPointer)) {
            return expectedPointer;
        }

        // Use the same strategy as Solady's SSTORE2 to write a data contract, but do this via the deployer for a constant address
        // https://github.com/Vectorized/solady/blob/cb801a60f8319a148697b09d19b748d04e3d65c4/src/utils/SSTORE2.sol#L44-L59
        bytes memory creationCode = abi.encodePacked(
            bytes11(0x61000080600a3d393df300) |
                // Overlay content size (plus data offset) into second and third bytes
                bytes11(bytes3(uint24(content.length + SSTORE2.DATA_OFFSET))),
            content
        );

        (bool success, bytes memory data) = deployer.call(
            abi.encodePacked(salt, creationCode)
        );
        if (!success) revertWithBytes(data);

        pointer = address(uint160(bytes20(data)));
        if (pointer != expectedPointer) {
            revert UnexpectedPointer(expectedPointer, pointer);
        }

        emit NewContent(pointer, uint32(content.length));
    }

    /// @notice Convenience method for getting content in frontends and indexers where libraries are not accessible.
    /// @dev Contracts should use `SSTORE2.read()` directly, rather than this method. Otherwise you will incur unnecessary gas for passing around large byte blobs.
    /// @param pointer The address of the content to retrieve
    /// @return content The content stored at the pointer address
    function getContent(
        address pointer
    ) public view returns (bytes memory content) {
        if (!pointerExists(pointer)) {
            revert ContentNotFound(pointer);
        }
        return SSTORE2.read(pointer);
    }
}
