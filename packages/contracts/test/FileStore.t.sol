// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {IChunkStore, ChunkStore} from "../src/approach1/ChunkStore.sol";
import {IFileStore, FileStore, File} from "../src/approach1/FileStore.sol";

contract FileStoreTest is Test, IChunkStore, IFileStore {
    FileStore private fileStore;

    function setUp() public {
        fileStore = new FileStore();
    }

    function testWrite() public {
        bytes memory data = bytes(
            vm.readFile("packages/contracts/test/files/24kb-1.txt")
        );
        bytes32 checksum = keccak256(data);

        assertFalse(
            fileStore.checksumExists(checksum),
            "expected checksum to not exist"
        );

        vm.expectEmit(true, true, true, true);
        emit NewChunk(checksum, data.length);

        fileStore.writeChunk(data);

        assertTrue(
            fileStore.checksumExists(checksum),
            "expected checksum to exist"
        );

        bytes memory storedData = fileStore.readChunk(checksum);

        assertEq(data, storedData, "expected data to match");
        assertEq(
            checksum,
            keccak256(storedData),
            "expected checksums to match"
        );
    }

    function testWriteTooBig() public {
        vm.expectRevert(
            abi.encodeWithSelector(ChunkStore.ChunkTooBig.selector)
        );
        fileStore.writeChunk(
            bytes(vm.readFile("packages/contracts/test/files/24kb.txt"))
        );
    }

    function testReadFileData() public {
        bytes32[] memory checksums = new bytes32[](3);
        checksums[0] = fileStore.writeChunk("hello");
        checksums[1] = fileStore.writeChunk(" ");
        checksums[2] = fileStore.writeChunk("world");

        (bytes32 fileChecksum, ) = fileStore.writeFile(
            "text/plain",
            "",
            checksums
        );

        assertEq("hello world", fileStore.readFileData(fileChecksum));
    }

    function testReadFileDataBig() public {
        bytes memory data = bytes(
            vm.readFile("packages/contracts/test/files/24kb-1.txt")
        );

        vm.expectEmit(true, true, true, true);
        emit NewChunk(keccak256(data), data.length);

        bytes32 checksum = fileStore.writeChunk(data);

        bytes32[] memory checksums = new bytes32[](2);
        checksums[0] = checksum;
        checksums[1] = checksum;

        File memory expectedFile = File({
            size: data.length * 2,
            contentType: "text/plain",
            contentEncoding: "",
            checksums: checksums
        });

        vm.expectEmit(true, true, true, true);
        emit NewFile(
            keccak256(abi.encode(expectedFile)),
            expectedFile.size,
            expectedFile.contentType,
            expectedFile.contentEncoding
        );

        (bytes32 fileChecksum, ) = fileStore.writeFile(
            "text/plain",
            "",
            checksums
        );

        vm.expectRevert(
            abi.encodeWithSelector(
                ChunkStore.ChunkExists.selector,
                fileChecksum
            )
        );

        fileStore.writeFile("text/plain", "", checksums);

        assertEq(
            bytes(vm.readFile("packages/contracts/test/files/48kb-2.txt")),
            fileStore.readFileData(fileChecksum)
        );
    }
}
