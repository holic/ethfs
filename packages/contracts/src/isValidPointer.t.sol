// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {isValidPointer} from "./isValidPointer.sol";

contract IsValidPointerTest is Test, GasReporter {
    function testValidPointer() public {
        address pointer = SSTORE2.write("hello world");
        assertEq("hello world", SSTORE2.read(pointer));

        assertTrue(
            isValidPointer(pointer),
            "expected isValidPointer(pointer) to return true"
        );

        startGasReport("check valid pointer");
        isValidPointer(pointer);
        endGasReport();
    }

    function testBigPointer() public {
        bytes memory contents = bytes(
            vm.readFile("test/files/sstore2-max.txt")
        );
        address pointer = SSTORE2.write(contents);
        assertEq(contents, SSTORE2.read(pointer));

        assertTrue(
            isValidPointer(pointer),
            "expected isValidPointer(pointer) to return true"
        );

        startGasReport("check big pointer");
        isValidPointer(pointer);
        endGasReport();
    }

    function testInvalidPointer() public {
        assertFalse(
            isValidPointer(address(this)),
            "expected isValidPointer(address(this)) to return false"
        );

        startGasReport("check invalid pointer");
        isValidPointer(address(this));
        endGasReport();
    }

    function testNonexistentPointer() public {
        assertFalse(
            isValidPointer(address(0)),
            "expected isValidPointer(address(0)) to return false"
        );

        startGasReport("check non-existent pointer");
        isValidPointer(address(0));
        endGasReport();
    }
}
