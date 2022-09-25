// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

struct Content {
    bytes32 checksum;
    address pointer;
}

struct File {
    uint256 size; // content length in bytes, max 24k
    Content[] contents;
}

function read(File memory file) view returns (string memory contents) {
    address[] memory pointers = new address[](file.contents.length);
    for (uint256 i = 0; i < file.contents.length; i++) {
        pointers[i] = file.contents[i].pointer;
    }

    // Adapted from https://gist.github.com/xtremetom/20411eb126aaf35f98c8a8ffa00123cd
    assembly {
        let len := mload(pointers)
        let totalSize := 0x20
        let size := 0
        contents := mload(0x40)

        // loop through all pointer addresses
        // - get address
        // - get data size
        // - get code and add to contents
        // - update total size
        let pointer := 0
        for { let i := 0 } lt(i, len) { i := add(i, 1) } {
            pointer := mload(add(pointers, add(0x20, mul(i, 0x20))))
            size := sub(extcodesize(pointer), 1)
            extcodecopy(pointer, add(contents, totalSize), 1, size)
            totalSize := add(totalSize, size)
        }

        // update contents size
        mstore(contents, sub(totalSize, 0x20))
        // store contents
        mstore(0x40, add(contents, and(add(totalSize, 0x1f), not(0x1f))))
    }
}

using {
    read
} for File global;
