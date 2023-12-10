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

    // TODO: import/reference from IFileStore instead of duplicating
    event FileCreated(
        string indexed indexedFilename,
        address indexed pointer,
        string filename,
        uint256 size,
        bytes metadata
    );
    event FileDeleted(
        string indexed indexedFilename,
        address indexed pointer,
        string filename
    );

    function setUp() public {
        // TODO: set up deployer instead of using CREATE2_FACTORY
        contentStore = new ContentStore(
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );
        fileStore = new FileStore(contentStore);

        address pointer = fileStore.contentStore().addContent(
            bytes(vm.readFile("test/files/sstore2-max.txt"))
        );

        address[] memory pointers = new address[](4);
        pointers[0] = pointer;
        pointers[1] = pointer;
        pointers[2] = pointer;
        pointers[3] = pointer;

        uint256 startGas = gasleft();
        (address bigFilePointer, ) = fileStore.createFile("big.txt", pointers);
        console.log("FileStore.createFile gas", startGas - gasleft());
        console.log("created big.txt file", bigFilePointer);
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
        string memory contents = vm.readFile("test/files/sstore2-max.txt");
        address pointer = fileStore.contentStore().pointerForContent(
            bytes(contents)
        );

        address[] memory pointers = new address[](1);
        pointers[0] = pointer;

        vm.expectEmit(true, false, true, true);
        emit FileCreated(
            "24kb.txt",
            address(0),
            "24kb.txt",
            24575,
            new bytes(0)
        );

        (, File memory file) = fileStore.createFile("24kb.txt", pointers);

        assertEq(file.size, 24575);
        assertEq(bytes(file.read()).length, 24575);
        assertEq(file.read(), contents);

        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FilenameExists.selector,
                "24kb.txt"
            )
        );
        fileStore.createFile("24kb.txt", pointers);
    }

    function testCreateFileWithExtraData() public {
        address pointer = fileStore.contentStore().addContent(
            bytes("hello world")
        );
        address[] memory pointers = new address[](1);
        pointers[0] = pointer;

        vm.expectEmit(true, false, true, true);
        emit FileCreated(
            "hello.txt",
            address(0),
            "hello.txt",
            11,
            bytes("hello world")
        );

        fileStore.createFile("hello.txt", pointers, bytes("hello world"));
    }

    function testDeleteFile() public {
        assertTrue(
            fileStore.fileExists("big.txt"),
            "expected file big.txt to exist"
        );

        vm.expectEmit(true, true, true, true);
        emit FileDeleted(
            "big.txt",
            address(0x77D0d321c8bdD4C3D4cC7692252aCa06a292902B),
            "big.txt"
        );

        fileStore.deleteFile("big.txt");
        assertFalse(
            fileStore.fileExists("big.txt"),
            "expected file big.txt to no longer exist"
        );
    }
}
