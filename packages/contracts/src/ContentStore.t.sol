// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "./IContentStore.sol";
import {ContentStore} from "./ContentStore.sol";
import {Deployed} from "./common.sol";
import {SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE} from "../test/safeSingletonFactory.sol";

contract ContentStoreTest is Test, GasReporter {
    IContentStore public contentStore;

    function setUp() public {
        vm.etch(SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE);
        contentStore = new ContentStore(SAFE_SINGLETON_FACTORY);
    }

    function testConstructor() public {
        vm.expectEmit(true, true, true, true);
        emit Deployed();
        new ContentStore(SAFE_SINGLETON_FACTORY);
    }

    function testAddContent() public {
        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        startGasReport("compute pointer");
        address pointer = contentStore.getPointer(content);
        endGasReport();

        assertEq(pointer, address(0x3c7F9F8bB96905325CdD1782d55B8Ebd6228Ed2e));
        assertFalse(
            contentStore.pointerExists(pointer),
            "expected checksum to not exist"
        );

        vm.expectEmit(true, true, true, true);
        emit IContentStore.NewContent(pointer, uint32(content.length));
        startGasReport("add content");
        address newPointer = contentStore.addContent(content);
        endGasReport();
        assertEq(newPointer, pointer);

        // Adding the same content should just return pointer
        startGasReport("add existing content");
        contentStore.addContent(content);
        endGasReport();

        assertTrue(
            contentStore.pointerExists(pointer),
            "expected pointer to exist"
        );

        bytes memory storedContent = SSTORE2.read(pointer);

        assertEq(contentStore.contentLength(pointer), content.length);
        assertEq(storedContent, content, "expected content to match");
    }

    function testContentLength() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ContentNotFound.selector,
                address(0)
            )
        );
        contentStore.contentLength(address(0));
    }

    function testGetContent() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ContentNotFound.selector,
                address(0)
            )
        );
        contentStore.getContent(address(0));
    }

    function testDeterministicPointer() public {
        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        address pointer = contentStore.addContent(content);

        // TODO: set up deployer instead of using CREATE2_FACTORY
        ContentStore secondContentStore = new ContentStore(
            SAFE_SINGLETON_FACTORY
        );

        assertEq(pointer, secondContentStore.addContent(content));
    }
}
