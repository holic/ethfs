// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {ChunkStore} from "./ChunkStore.sol";

// TODO: indicate when a file is already base64 encoded, html escaped, json escaped?

struct File {
    uint256 size; // automatically calculated on write
    string contentType; // e.g. image/png, text/javascript, datauri
    string contentEncoding; // optional, e.g. gzip
    bytes32[] checksums;
}

contract FileStore is ChunkStore {
    error EmptyFile();

    event NewFile(
        bytes32 indexed checksum,
        uint256 size,
        string contentType,
        string contentEncoding
    );

    function writeFile(
        string memory contentType,
        string memory contentEncoding,
        bytes[] memory chunks
    ) public returns (bytes32 checksum, File memory file) {
        return writeFile(contentType, contentEncoding, writeChunks(chunks));
    }

    function writeFile(
        string memory contentType,
        string memory contentEncoding,
        bytes32[] memory checksums
    ) public returns (bytes32 checksum, File memory file) {
        uint256 size = 0;
        // TODO: optimize this
        for (uint256 i = 0; i < checksums.length; i++) {
            size += chunkSize(checksums[i]);
        }
        if (size == 0) {
            revert EmptyFile();
        }
        file = File({
            size: size,
            contentType: contentType,
            contentEncoding: contentEncoding,
            checksums: checksums
        });
        checksum = writeChunk(abi.encode(file));
        emit NewFile(
            checksum,
            file.size,
            file.contentType,
            file.contentEncoding
        );
        return (checksum, file);
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
        return readBytes(file.size, file.checksums);
    }
}
