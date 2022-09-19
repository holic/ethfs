// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";

interface IChunkStore {
    event NewChunk(bytes32 indexed checksum, uint256 size);
}

abstract contract ChunkStore is IChunkStore {
    // data checksum => sstore2 pointer
    mapping(bytes32 => address) public _chunks;
    bytes32[] public _checksums;

    error ChunkTooBig();
    error ChunkExists(bytes32 checksum);
    error ChunkNotFound(bytes32 checksum);

    function checksumExists(bytes32 checksum) public view returns (bool) {
        return _chunks[checksum] != address(0);
    }

    function chunkSize(bytes32 checksum) public view returns (uint256 size) {
        if (!checksumExists(checksum)) {
            revert ChunkNotFound(checksum);
        }
        return Bytecode.codeSize(_chunks[checksum]) - 1;
    }

    function writeChunk(bytes memory chunk) public returns (bytes32 checksum) {
        if (chunk.length > 24575) {
            revert ChunkTooBig();
        }
        checksum = keccak256(chunk);
        if (_chunks[checksum] != address(0)) {
            revert ChunkExists(checksum);
        }
        _chunks[checksum] = SSTORE2.write(chunk);
        _checksums.push(checksum);
        emit NewChunk(checksum, chunk.length);
        return checksum;
    }

    function writeChunks(bytes[] memory chunks)
        public
        returns (bytes32[] memory fileChecksums)
    {
        fileChecksums = new bytes32[](chunks.length);
        for (uint256 i = 0; i < chunks.length; i++) {
            fileChecksums[i] = writeChunk(chunks[i]);
        }
        return fileChecksums;
    }

    function readChunk(bytes32 checksum)
        public
        view
        returns (bytes memory chunk)
    {
        if (!checksumExists(checksum)) {
            revert ChunkNotFound(checksum);
        }
        return SSTORE2.read(_chunks[checksum]);
    }

    function readChunks(bytes32[] memory checksums)
        public
        view
        returns (bytes[] memory chunks)
    {
        chunks = new bytes[](checksums.length);
        for (uint256 i = 0; i < checksums.length; i++) {
            chunks[i] = readChunk(checksums[i]);
        }
        return chunks;
    }

    function readBytes(uint256 size, bytes32[] memory checksums)
        public
        view
        returns (bytes memory data)
    {
        data = DynamicBuffer.allocate(size);
        for (uint256 i = 0; i < checksums.length; i++) {
            bytes memory chunk = readChunk(checksums[i]);
            DynamicBuffer.appendSafe(data, chunk);
        }
        return data;
    }
}
