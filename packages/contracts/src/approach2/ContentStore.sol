// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";

interface IContentStore {
    event NewChecksum(bytes32 indexed checksum, uint256 contentSize);
}

contract ContentStore is IContentStore {
    // content checksum => sstore2 pointer
    mapping(bytes32 => address) public _pointers;
    bytes32[] public _checksums;

    error ContentTooBig();
    error ChecksumExists(bytes32 checksum);
    error ChecksumNotFound(bytes32 checksum);

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
        return Bytecode.codeSize(_pointers[checksum]) - 1;
    }

    function addPointer(address pointer) public returns (bytes32 checksum) {
        checksum = keccak256(SSTORE2.read(pointer));
        if (_pointers[checksum] != address(0)) {
            return checksum;
        }
        _pointers[checksum] = pointer;
        _checksums.push(checksum);
        emit NewChecksum(checksum, Bytecode.codeSize(pointer) - 1);
        return checksum;
    }

    function addContent(bytes memory content)
        public
        returns (bytes32 checksum)
    {
        if (content.length > 24575) {
            revert ContentTooBig();
        }
        checksum = keccak256(content);
        if (_pointers[checksum] != address(0)) {
            return checksum;
        }
        _pointers[checksum] = SSTORE2.write(content);
        _checksums.push(checksum);
        emit NewChecksum(checksum, content.length);
        return checksum;
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
