// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "sstore2/SSTORE2.sol";

contract BlobStore {
    // blob checksum => sstore2 pointer
    mapping(bytes32 => address) public blobs;
    bytes32[] public checksums;

    error BlobExists();

    function checksumExists(bytes32 checksum) public view returns (bool) {
        return blobs[checksum] != address(0);
    }

    function write(bytes calldata blob) public {
        if (checksumExists(keccak256(blob))) {
            revert BlobExists();
        }
        blobs[keccak256(blob)] = SSTORE2.write(blob);
        checksums.push(keccak256(blob));
    }

    function read(bytes32 checksum) public view returns (bytes memory) {
        return SSTORE2.read(blobs[checksum]);
    }
}
