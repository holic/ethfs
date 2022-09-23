// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "./IContentStore.sol";

contract ContentStore is IContentStore {
    // content checksum => sstore2 pointer
    mapping(bytes32 => address) public _pointers;
    bytes32[] public _checksums;

    function checksumExists(bytes32 checksum) public view returns (bool) {
        return _pointers[checksum] != address(0);
    }

    function contentLength(bytes32 checksum)
        public
        view
        returns (uint256 size)
    {
        if (!checksumExists(checksum)) {
            revert ChecksumNotFound(checksum);
        }
        return SSTORE2.read(_pointers[checksum]).length;
    }

    function addPointer(address pointer) public returns (bytes32 checksum) {
        bytes memory content = SSTORE2.read(pointer);
        checksum = keccak256(content);
        if (_pointers[checksum] != address(0)) {
            return checksum;
        }
        _pointers[checksum] = pointer;
        _checksums.push(checksum);
        emit NewChecksum(checksum, content.length);
        return checksum;
    }

    function addContent(bytes memory content)
        public
        returns (bytes32 checksum, address pointer)
    {
        // TODO: get rid of this check before deploy
        if (content.length > 24575) {
            revert ContentTooBig();
        }
        checksum = keccak256(content);
        if (_pointers[checksum] != address(0)) {
            return (checksum, _pointers[checksum]);
        }
        pointer = SSTORE2.write(content);
        _pointers[checksum] = pointer;
        _checksums.push(checksum);
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
        return _pointers[checksum];
    }
}
