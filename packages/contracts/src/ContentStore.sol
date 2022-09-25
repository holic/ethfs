// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "./IContentStore.sol";

contract ContentStore is IContentStore {
    // content checksum => sstore2 pointer
    mapping(bytes32 => address) public pointers;

    function checksumExists(bytes32 checksum) public view returns (bool) {
        return pointers[checksum] != address(0);
    }

    function contentLength(bytes32 checksum)
        public
        view
        returns (uint256 size)
    {
        if (!checksumExists(checksum)) {
            revert ChecksumNotFound(checksum);
        }
        return SSTORE2.read(pointers[checksum]).length;
    }

    function addPointer(address pointer) public returns (bytes32 checksum) {
        bytes memory content = SSTORE2.read(pointer);
        checksum = keccak256(content);
        if (pointers[checksum] != address(0)) {
            return checksum;
        }
        pointers[checksum] = pointer;
        emit NewChecksum(checksum, content.length);
        return checksum;
    }

    function addContent(bytes memory content)
        public
        returns (bytes32 checksum, address pointer)
    {
        checksum = keccak256(content);
        if (pointers[checksum] != address(0)) {
            return (checksum, pointers[checksum]);
        }
        pointer = SSTORE2.write(content);
        pointers[checksum] = pointer;
        emit NewChecksum(checksum, content.length);
        return (checksum, pointer);
    }

    function getPointer(bytes32 checksum)
        public
        view
        returns (address pointer)
    {
        if (!checksumExists(checksum)) {
            revert ChecksumNotFound(checksum);
        }
        return pointers[checksum];
    }
}
