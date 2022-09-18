// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";

struct File {
    uint256 size; // automatically calculated on write
    string contentType; // e.g. image/png, text/javascript, datauri
    string contentEncoding; // optional, e.g. gzip
    bytes32[] checksums;
}

interface IFileStore {
    event NewChunk(bytes32 indexed checksum, uint256 size);
    event NewFile(
        bytes32 indexed checksum,
        uint256 size,
        string contentType,
        string contentEncoding
    );
}

// TODO: clarify that these are already encoded as data URI for easy inclusion in HTML?

contract FileStore is IFileStore {
    // data checksum => sstore2 pointer
    mapping(bytes32 => address) public chunks;
    bytes32[] public checksums;

    error ChunkTooBig();
    error ChunkExists(bytes32 checksum);
    error ChunkNotFound(bytes32 checksum);
    error EmptyFile();

    function checksumExists(bytes32 checksum) public view returns (bool) {
        return chunks[checksum] != address(0);
    }

    function chunkSize(bytes32 checksum) public view returns (uint256 size) {
        if (!checksumExists(checksum)) {
            revert ChunkNotFound(checksum);
        }
        return Bytecode.codeSize(chunks[checksum]) - 1;
    }

    function writeChunk(bytes memory chunk) public returns (bytes32 checksum) {
        if (chunk.length > 24575) {
            revert ChunkTooBig();
        }
        checksum = keccak256(chunk);
        if (chunks[checksum] != address(0)) {
            revert ChunkExists(checksum);
        }
        chunks[checksum] = SSTORE2.write(chunk);
        checksums.push(checksum);
        emit NewChunk(checksum, chunk.length);
        return checksum;
    }

    function writeFile(File memory file) public returns (bytes32 checksum) {
        uint256 size = 0;
        // TODO: optimize this
        for (uint256 i = 0; i < file.checksums.length; i++) {
            size += chunkSize(file.checksums[i]);
        }
        if (size == 0) {
            revert EmptyFile();
        }
        file.size = size;
        checksum = writeChunk(abi.encode(file));
        emit NewFile(checksum, size, file.contentType, file.contentEncoding);
        return checksum;
    }

    function readChunk(bytes32 checksum)
        public
        view
        returns (bytes memory chunk)
    {
        if (!checksumExists(checksum)) {
            revert ChunkNotFound(checksum);
        }
        return SSTORE2.read(chunks[checksum]);
    }

    function readFile(bytes32 checksum) public view returns (File memory file) {
        return abi.decode(readChunk(checksum), (File));
    }

    function readFileData(bytes32 checksum)
        public
        view
        returns (bytes memory data)
    {
        return readFileData(readFile(checksum));
    }

    function readFileData(File memory file)
        public
        view
        returns (bytes memory data)
    {
        uint256 size = file.size;
        data = DynamicBuffer.allocate(size);
        for (uint256 i = 0; i < file.checksums.length; i++) {
            bytes memory chunk = readChunk(file.checksums[i]);
            DynamicBuffer.appendSafe(data, chunk);
        }
        return data;
    }
}
