// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {IFileStore} from "../src/IFileStore.sol";
import {FileStore} from "../src/FileStore.sol";
import {File} from "../src/File.sol";

contract FileStoreTest is Test {
    IContentStore public contentStore;
    IFileStore public fileStore;

    event FileCreated(
        string indexed indexedFilename,
        bytes32 indexed checksum,
        string filename,
        uint256 size,
        bytes metadata
    );
    event FileDeleted(
        string indexed indexedFilename,
        bytes32 indexed checksum,
        string filename
    );

    function setUp() public {
        contentStore = new ContentStore();
        fileStore = new FileStore(contentStore);

        (bytes32 checksum, ) = fileStore.contentStore().addContent(
            bytes(vm.readFile("packages/contracts/test/files/sstore2-max.txt"))
        );

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = checksum;
        checksums[1] = checksum;
        checksums[2] = checksum;
        checksums[3] = checksum;

        uint256 startGas = gasleft();
        fileStore.createFile("big.txt", checksums);
        console.log("FileStore.createFile gas", startGas - gasleft());
    }

    function testGetChecksum() public {
        bytes32 checksum = fileStore.getChecksum("big.txt");
        assertEq(
            checksum,
            0x14c8282b35a841d7df042bc64f5a40da1368ecf57f97a50d878c8dfa4ba912a5
        );

        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FileNotFound.selector,
                "non-existent.txt"
            )
        );
        fileStore.getFile("non-existent.txt");
    }

    function testGetFile() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FileNotFound.selector,
                "non-existent.txt"
            )
        );
        fileStore.getFile("non-existent.txt");

        File memory file = fileStore.getFile("big.txt");

        assertEq(file.size, 98300);
        assertEq(bytes(file.read()).length, 98300);
    }

    function testCreateFile() public {
        string memory contents = vm.readFile(
            "packages/contracts/test/files/sstore2-max.txt"
        );
        (bytes32 checksum, ) = fileStore.contentStore().addContent(
            bytes(contents)
        );

        bytes32[] memory checksums = new bytes32[](1);
        checksums[0] = checksum;

        vm.expectEmit(true, false, true, true);
        emit FileCreated(
            "24kb.txt",
            bytes32(0),
            "24kb.txt",
            24575,
            new bytes(0)
        );

        File memory file = fileStore.createFile("24kb.txt", checksums);

        assertEq(file.size, 24575);
        assertEq(bytes(file.read()).length, 24575);
        assertEq(file.read(), contents);

        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FilenameExists.selector,
                "24kb.txt"
            )
        );
        fileStore.createFile("24kb.txt", checksums);
    }

    function testCreateFileWithExtraData() public {
        (bytes32 checksum, ) = fileStore.contentStore().addContent(
            bytes("hello world")
        );
        bytes32[] memory checksums = new bytes32[](1);
        checksums[0] = checksum;

        vm.expectEmit(true, false, true, true);
        emit FileCreated(
            "hello.txt",
            bytes32(0),
            "hello.txt",
            11,
            bytes("hello world")
        );

        fileStore.createFile("hello.txt", checksums, bytes("hello world"));
    }

    function testDeleteFile() public {
        assertTrue(
            fileStore.fileExists("big.txt"),
            "expected file big.txt to exist"
        );

        vm.expectEmit(true, true, true, true);
        emit FileDeleted(
            "big.txt",
            0x14c8282b35a841d7df042bc64f5a40da1368ecf57f97a50d878c8dfa4ba912a5,
            "big.txt"
        );

        fileStore.deleteFile("big.txt");
        assertFalse(
            fileStore.fileExists("big.txt"),
            "expected file big.txt to no longer exist"
        );
    }
}
