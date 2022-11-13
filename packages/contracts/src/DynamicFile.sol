// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

enum ChunkType {
    String,
    SSTORE2,
    File,
    DynamicFile,
    ExternalString
}

struct Chunk {
    ChunkType chunkType;
    bytes data;
}

struct DynamicFile {
    Chunk[] chunks;
}

function read(DynamicFile memory file) view returns (string memory contents) {
    Chunk[] memory chunks = file.chunks;

    // TODO: read diff chunk types

    // Adapted from https://gist.github.com/xtremetom/20411eb126aaf35f98c8a8ffa00123cd
    assembly {
        let len := mload(chunks)
        let totalSize := 0x20
        contents := mload(0x40)
        let size
        let chunk
        let pointer

        // loop through all pointer addresses
        // - get content
        // - get address
        // - get data size
        // - get code and add to contents
        // - update total size

        for { let i := 0 } lt(i, len) { i := add(i, 1) } {
            chunk := mload(add(chunks, add(0x20, mul(i, 0x20))))
            pointer := mload(add(chunk, 0x20))

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
} for DynamicFile global;
