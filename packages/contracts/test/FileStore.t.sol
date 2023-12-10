// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {IFileStore} from "../src/IFileStore.sol";
import {FileStore} from "../src/FileStore.sol";
import {File, ContentSlice} from "../src/File.sol";

contract FileStoreTest is Test, GasReporter {
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
    }

    function testCreateFile() public {
        string memory contents = vm.readFile("test/files/sstore2-max.txt");
        address pointer = fileStore.contentStore().addContent(bytes(contents));
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

        startGasReport("create 24kb file");
        (, File memory file) = fileStore.createFile("24kb.txt", pointers);
        endGasReport();

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
        assertEq(fileStore.getFile("hello.txt").read(), "hello world");
    }

    function testDeleteFile() public {
        address pointer = fileStore.contentStore().addContent(
            bytes("hello world")
        );
        address[] memory pointers = new address[](1);
        pointers[0] = pointer;
        fileStore.createFile("hello.txt", pointers);

        assertTrue(
            fileStore.fileExists("hello.txt"),
            "expected file hello.txt to exist"
        );

        vm.expectEmit(true, true, true, true);
        emit FileDeleted(
            "hello.txt",
            address(0xF44764Ce40B56EdF2788f159D78224F59dC0C839),
            "hello.txt"
        );

        fileStore.deleteFile("hello.txt");
        assertFalse(
            fileStore.fileExists("hello.txt"),
            "expected file hello.txt to no longer exist"
        );
    }

    function testBigFile() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FileNotFound.selector,
                "non-existent.txt"
            )
        );
        fileStore.getFile("non-existent.txt");

        address pointer = fileStore.contentStore().addContent(
            bytes(vm.readFile("test/files/sstore2-max.txt"))
        );

        address[] memory pointers = new address[](4);
        pointers[0] = pointer;
        pointers[1] = pointer;
        pointers[2] = pointer;
        pointers[3] = pointer;

        startGasReport("create big file");
        fileStore.createFile("big.txt", pointers);
        endGasReport();

        File memory file = fileStore.getFile("big.txt");
        startGasReport("read big file");
        file.read();
        endGasReport();

        assertEq(file.size, 98300);
        assertEq(bytes(file.read()).length, 98300);
    }

    function testSlices() public {
        address helloPointer = fileStore.contentStore().addContent(
            bytes(
                "The meaning of HELLO is an expression or gesture of greeting - used interjectionally in greeting, in answering the telephone, or to express surprise."
            )
        );
        address worldPointer = fileStore.contentStore().addContent(
            bytes(
                "The meaning of WORLD is the earthly state of human existence."
            )
        );
        ContentSlice[] memory slices = new ContentSlice[](3);
        slices[0] = ContentSlice({pointer: helloPointer, start: 15, end: 20});
        slices[1] = ContentSlice({pointer: worldPointer, start: 14, end: 20});
        slices[2] = ContentSlice({pointer: worldPointer, start: 60, end: 61});

        startGasReport("create file");
        fileStore.createFile("hello.txt", slices);
        endGasReport();

        startGasReport("read file");
        string memory contents = fileStore.getFile("hello.txt").read();
        endGasReport();

        assertEq(contents, "HELLO WORLD.");
    }
}
