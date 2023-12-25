// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE} from "../test/safeSingletonFactory.sol";
import {contentToInitCode, getPointer, pointerExists, addContent} from "./Content.sol";

contract ContentTest is Test, GasReporter {
    function setUp() public {
        vm.etch(SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE);
    }

    function testAddContent() public {
        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        startGasReport("compute pointer");
        address pointer = getPointer(SAFE_SINGLETON_FACTORY, content);
        endGasReport();

        assertEq(pointer, address(0x1fa2FC76CF0E28794803cd24B6D729B626F0aD25));
        assertFalse(pointerExists(pointer), "expected pointer to not exist");

        startGasReport("add content");
        address newPointer = addContent(SAFE_SINGLETON_FACTORY, content);
        endGasReport();
        assertEq(newPointer, pointer);

        // Adding the same content should just return pointer
        startGasReport("add existing content");
        addContent(SAFE_SINGLETON_FACTORY, content);
        endGasReport();

        assertTrue(pointerExists(pointer), "expected pointer to exist");

        bytes memory storedContent = SSTORE2.read(pointer);

        assertEq(pointer.code.length, content.length + 1);
        assertEq(storedContent, content, "expected content to match");
    }

    function testContentToInitCode() public {
        assertEq(
            contentToInitCode("hello world"),
            hex"61000c80600a3d393df30068656c6c6f20776f726c64"
        );
    }
}
