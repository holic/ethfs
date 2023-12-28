// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {File, BytecodeSlice, SliceOutOfBounds} from "./File.sol";

contract ExampleSelfDestruct {
    function explode() public {
        selfdestruct(payable(address(0)));
    }
}

contract FileTest is Test {
    ExampleSelfDestruct public exampleSelfDestruct;

    function setUp() public {
        // foundry doesn't support selfdestruct within tests, so we'll set this one up here
        // https://github.com/foundry-rs/foundry/issues/1543#issuecomment-1520405775
        exampleSelfDestruct = new ExampleSelfDestruct();
        exampleSelfDestruct.explode();
    }

    function testBytecode() public {
        address pointer = vm.addr(uint256(bytes32("some contract")));
        vm.etch(pointer, "some bytecode");

        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({pointer: pointer, start: 0, end: 4});
        File memory file = File({size: 4, slices: slices});
        string memory contents = file.read();
        assertEq(contents, "some");
    }

    function testCorruptedFileRead() public {
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: address(exampleSelfDestruct),
            start: 0,
            end: 10
        });
        File memory file = File({size: 10, slices: slices});
        vm.expectRevert(
            abi.encodeWithSelector(
                SliceOutOfBounds.selector,
                file.slices[0].pointer,
                0,
                file.slices[0].start,
                file.slices[0].end
            )
        );
        file.read();
    }

    function testCorruptedFileReadUnchecked() public {
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: address(exampleSelfDestruct),
            start: 0,
            end: 10
        });
        File memory file = File({size: 10, slices: slices});
        string memory contents = file.readUnchecked();
        assertEq(bytes(contents), bytes(""));
    }
}
