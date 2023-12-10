// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "./IContentStore.sol";
import {revertWithBytes} from "./revertWithBytes.sol";

contract ContentStore is IContentStore {
    address internal immutable deployer;
    bytes32 internal constant salt = bytes32(0);

    constructor(address _deployer) {
        deployer = _deployer;
    }

    function pointerExists(address pointer) public view returns (bool) {
        return getCodeSize(pointer) > 0;
    }

    function contentLength(address pointer) public view returns (uint32 size) {
        size = getCodeSize(pointer);
        if (size == 0) {
            revert ContentNotFound(pointer);
        }
        return size - uint32(SSTORE2.DATA_OFFSET);
    }

    function pointerForContent(
        bytes memory content
    ) public view returns (address) {
        return SSTORE2.predictDeterministicAddress(content, salt, deployer);
    }

    function addContent(bytes memory content) public returns (address pointer) {
        address expectedPointer = pointerForContent(content);
        if (pointerExists(expectedPointer)) {
            revert ContentAlreadyExists(expectedPointer);
        }

        bytes memory creationCode = abi.encodePacked(
            // Pulled from SSTORE2 source
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

        emit NewContent(pointer, uint16(content.length));
    }

    function getContent(
        address pointer
    ) public view returns (bytes memory content) {
        if (!pointerExists(pointer)) {
            revert ContentNotFound(pointer);
        }

        return SSTORE2.read(pointer);
    }

    function getCodeSize(address target) internal view returns (uint32 size) {
        assembly {
            size := extcodesize(target)
        }
    }
}
