// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "./IContentStore.sol";
import {ContentStore} from "./ContentStore.sol";
import {IFileStore} from "./IFileStore.sol";
import {FileStore} from "./FileStore.sol";
import {File, BytecodeSlice, SliceOutOfBounds} from "./File.sol";
import {Deployed} from "./common.sol";
import {SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE} from "../test/safeSingletonFactory.sol";

contract FileStoreTest is Test, GasReporter {
    IContentStore public contentStore;
    IFileStore public fileStore;

    function setUp() public {
        vm.etch(SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE);
        contentStore = new ContentStore(SAFE_SINGLETON_FACTORY);
        fileStore = new FileStore(contentStore);
    }

    function testConstructor() public {
        vm.expectEmit(true, true, true, true);
        emit Deployed();
        new FileStore(contentStore);
    }

    function testCreateFile() public {
        string memory contents = vm.readFile("test/files/sstore2-max.txt");

        startGasReport("create 24kb file");
        (, File memory file) = fileStore.createFile("24kb.txt", contents);
        endGasReport();

        assertEq(file.size, 24575);
        assertEq(bytes(file.read()).length, 24575);
        assertEq(file.read(), contents);
        assertEq(file.slices.length, 1);

        startGasReport("create 24kb file with two chunks, reusing one");
        (, File memory secondFile) = fileStore.createFile(
            "one-byte-overflow.txt",
            string.concat(contents, "z")
        );
        endGasReport();

        assertEq(secondFile.size, 24576);
        assertEq(bytes(secondFile.read()).length, 24576);
        assertEq(secondFile.read(), string.concat(contents, "z"));
        assertEq(secondFile.slices.length, 2);
        assertEq(file.slices[0].pointer, secondFile.slices[0].pointer);
    }

    function testCreateFileFromChunks() public {
        string[] memory chunks = new string[](3);
        chunks[0] = "hello";
        chunks[1] = " ";
        chunks[2] = "world";

        startGasReport("create file from chunks");
        (, File memory file) = fileStore.createFileFromChunks(
            "helloworld.txt",
            chunks
        );
        endGasReport();

        assertEq(file.size, 11);
        assertEq(bytes(file.read()).length, 11);
        assertEq(file.read(), "hello world");
        assertEq(file.slices.length, 3);
        assertEq(SSTORE2.read(file.slices[0].pointer), "hello");
        assertEq(SSTORE2.read(file.slices[1].pointer), " ");
        assertEq(SSTORE2.read(file.slices[2].pointer), "world");
    }

    function testCreateFileFromSlices() public {
        string memory contents = vm.readFile("test/files/sstore2-max.txt");
        address pointer = fileStore.contentStore().addContent(bytes(contents));

        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: pointer,
            size: uint32(bytes(contents).length),
            offset: 1
        });

        vm.expectEmit(true, false, true, true);
        emit IFileStore.FileCreated(
            "24kb.txt",
            address(0),
            "24kb.txt",
            24575,
            new bytes(0)
        );

        startGasReport("create 24kb file");
        (, File memory file) = fileStore.createFileFromSlices(
            "24kb.txt",
            slices
        );
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
        fileStore.createFileFromSlices("24kb.txt", slices);
    }

    function testCreateFileFromPointers() public {
        string memory contents = vm.readFile("test/files/sstore2-max.txt");
        address pointer = fileStore.contentStore().addContent(bytes(contents));
        address[] memory pointers = new address[](1);
        pointers[0] = pointer;

        vm.expectEmit(true, false, true, true);
        emit IFileStore.FileCreated(
            "24kb.txt",
            address(0),
            "24kb.txt",
            24575,
            new bytes(0)
        );

        startGasReport("create 24kb file");
        (, File memory file) = fileStore.createFileFromPointers(
            "24kb.txt",
            pointers
        );
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
        fileStore.createFileFromPointers("24kb.txt", pointers);
    }

    function testCreateFileWithMetadata() public {
        bytes memory content = "hello world";
        address pointer = fileStore.contentStore().addContent(content);
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: pointer,
            size: uint32(content.length),
            offset: 1
        });

        vm.expectEmit(true, false, true, true);
        emit IFileStore.FileCreated(
            "hello.txt",
            address(0),
            "hello.txt",
            11,
            bytes("some metadata")
        );
        fileStore.createFileFromSlices(
            "hello.txt",
            slices,
            bytes("some metadata")
        );
        assertEq(fileStore.getFile("hello.txt").read(), "hello world");
    }

    function testCreateFileFromExistingContents() public {
        bytes memory content = "hello world";
        address pointer = fileStore.contentStore().addContent(content);
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: pointer,
            size: uint32(content.length),
            offset: 1
        });
        fileStore.createFileFromSlices(
            "hello.txt",
            slices,
            bytes("some metadata")
        );

        vm.expectEmit(true, false, true, true);
        emit IFileStore.FileCreated(
            "same.txt",
            address(0),
            "same.txt",
            11,
            bytes("some metadata")
        );
        fileStore.createFileFromSlices(
            "same.txt",
            slices,
            bytes("some metadata")
        );
        assertEq(fileStore.getFile("same.txt").read(), "hello world");
    }

    function testNonExistentFile() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FileNotFound.selector,
                "non-existent.txt"
            )
        );
        fileStore.getFile("non-existent.txt");
    }

    function testBigFile() public {
        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        startGasReport("add 24kb content");
        address pointer = fileStore.contentStore().addContent(content);
        endGasReport();

        BytecodeSlice[] memory slices = new BytecodeSlice[](4);
        slices[0] = BytecodeSlice({
            pointer: pointer,
            size: uint32(content.length),
            offset: 1
        });
        slices[1] = BytecodeSlice({
            pointer: pointer,
            size: uint32(content.length),
            offset: 1
        });
        slices[2] = BytecodeSlice({
            pointer: pointer,
            size: uint32(content.length),
            offset: 1
        });
        slices[3] = BytecodeSlice({
            pointer: pointer,
            size: uint32(content.length),
            offset: 1
        });

        startGasReport("create big file");
        fileStore.createFileFromSlices("big.txt", slices);
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
        BytecodeSlice[] memory slices = new BytecodeSlice[](3);
        slices[0] = BytecodeSlice({pointer: helloPointer, offset: 16, size: 5});
        slices[1] = BytecodeSlice({pointer: worldPointer, offset: 15, size: 6});
        slices[2] = BytecodeSlice({pointer: worldPointer, offset: 61, size: 1});

        startGasReport("create file");
        fileStore.createFileFromSlices("hello.txt", slices);
        endGasReport();

        startGasReport("read file");
        string memory contents = fileStore.getFile("hello.txt").read();
        endGasReport();

        assertEq(contents, "HELLO WORLD.");
    }

    function testBytecode() public {
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: address(contentStore),
            offset: 0,
            size: 10
        });

        startGasReport("create file");
        fileStore.createFileFromSlices("file.txt", slices);
        endGasReport();

        startGasReport("read file");
        string memory contents = fileStore.getFile("file.txt").read();
        endGasReport();

        assertEq(bytes(contents), hex"60806040523480156100");
    }
}
