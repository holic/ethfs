// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {IContentStore} from "./IContentStore.sol";
import {ContentStore} from "./ContentStore.sol";
import {IFileStore} from "./IFileStore.sol";
import {FileStore} from "./FileStore.sol";
import {File, BytecodeSlice, SliceOutOfBounds} from "./File.sol";
import {Deployed} from "./common.sol";

contract ExampleSelfDestruct {
    function explode() public {
        selfdestruct(payable(address(0)));
    }
}

contract FileStoreTest is Test, GasReporter {
    IContentStore public contentStore;
    IFileStore public fileStore;
    ExampleSelfDestruct public exampleSelfDestruct;

    function setUp() public {
        contentStore = new ContentStore(
            // TODO: set up safe singleton instead of using CREATE2_FACTORY address
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );
        fileStore = new FileStore(contentStore);

        // foundry doesn't support selfdestruct within tests, so we'll set this one up here
        // https://github.com/foundry-rs/foundry/issues/1543#issuecomment-1520405775
        exampleSelfDestruct = new ExampleSelfDestruct();
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: address(exampleSelfDestruct),
            offset: 0,
            size: 10
        });
        fileStore.createFileFromSlices("corrupt.txt", slices);
        exampleSelfDestruct.explode();
    }

    function testConstructor() public {
        vm.expectEmit(true, true, true, true);
        emit Deployed();
        new FileStore(contentStore);
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

    function testCreateFileWithExtraData() public {
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

    function testBigFile() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IFileStore.FileNotFound.selector,
                "non-existent.txt"
            )
        );
        fileStore.getFile("non-existent.txt");

        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        address pointer = fileStore.contentStore().addContent(content);

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

    function testCorruptedFileReadUnchecked() public {
        File memory file = fileStore.getFile("corrupt.txt");
        string memory contents = file.readUnchecked();
        assertEq(bytes(contents), bytes(""));
    }

    function testCorruptedFileRead() public {
        File memory file = fileStore.getFile("corrupt.txt");
        vm.expectRevert(
            abi.encodeWithSelector(
                SliceOutOfBounds.selector,
                file.slices[0].pointer,
                0,
                file.slices[0].size,
                file.slices[0].offset
            )
        );
        // foundry doesn't support expectRevert for library calls, so we need to call a wrapped function
        // https://github.com/foundry-rs/foundry/issues/4405
        this._readFile(file);
    }

    // foundry doesn't support expectRevert for library calls, so we need to wrap it in a function
    // https://github.com/foundry-rs/foundry/issues/4405
    function _readFile(File memory file) public view {
        file.read();
    }

    function _getCode(
        address target
    ) internal view returns (bytes memory code) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(target)
        }

        code = new bytes(codeSize);
        assembly {
            // Note: add(code, 32) is used because the first 32 bytes of a 'bytes' array
            // is the length of the array.
            extcodecopy(target, add(code, 32), 0, codeSize)
        }

        return code;
    }
}
