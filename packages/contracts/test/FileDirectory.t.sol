// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "../src/FileDirectory.sol";
import "../src/FileStore.sol";

contract FileDirectoryTest is Test, IFileDirectory {
    FileStore private fileStore;
    FileDirectory private directory;

    function setUp() public {
        fileStore = new FileStore();
        directory = new FileDirectory(fileStore);
    }

    function testWriteFile() public {
        bytes memory data = bytes("hello world");
        bytes32[] memory checksums = new bytes32[](1);
        checksums[0] = fileStore.writeChunk(data);

        vm.expectEmit(true, false, false, false);
        emit FileCreated("hello.txt", bytes32(0), 0, "text/plain", "");

        directory.createFile(
            "hello.txt",
            File({
                size: data.length,
                contentType: "text/plain",
                contentEncoding: "",
                checksums: checksums
            })
        );

        bytes memory storedData = directory.readFileData("hello.txt");
        assertEq("hello world", string(storedData));
    }
}
