// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {IFileDirectory, FileDirectory, File} from "../src/FileDirectory.sol";
import {FileReader} from "../src/FileReader.sol";

contract FileDirectoryTest is Test, IFileDirectory {
    FileDirectory private directory;

    function setUp() public {
        directory = new FileDirectory();

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = directory.writeChunk(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );
        checksums[1] = checksums[0];
        checksums[2] = checksums[0];
        checksums[3] = checksums[0];

        directory.createFile("big.txt", "text/plain", "", checksums);
    }

    function testWriteFile() public {
        bytes memory data = bytes("hello world");
        bytes32[] memory checksums = new bytes32[](1);
        checksums[0] = directory.writeChunk(data);

        vm.expectEmit(true, false, false, false);
        emit FileCreated("hello.txt", bytes32(0), 0, "text/plain", "");

        directory.createFile("hello.txt", "text/plain", "", checksums);

        bytes memory storedData = directory.readNamedFileData("hello.txt");
        assertEq(string(storedData), "hello world");
    }

    function testReadBigFile() public {
        uint256 startGas = gasleft();
        (File memory file, address[] memory pointers) = directory.readNamedFile(
            "big.txt"
        );
        bytes memory storedData = FileReader.readBytes(file.size, pointers);
        console.log("read gas used:", startGas - gasleft());

        assertEq(storedData.length, 98300);
    }
}
