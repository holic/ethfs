// SPDX-License-Identifier: Unlicense
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

    function testCorruptedFileReadUnchecked() public {
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: address(exampleSelfDestruct),
            offset: 0,
            size: 10
        });
        File memory file = File({size: 10, slices: slices});
        string memory contents = file.readUnchecked();
        assertEq(bytes(contents), bytes(""));
    }

    function testCorruptedFileRead() public {
        BytecodeSlice[] memory slices = new BytecodeSlice[](1);
        slices[0] = BytecodeSlice({
            pointer: address(exampleSelfDestruct),
            offset: 0,
            size: 10
        });
        File memory file = File({size: 10, slices: slices});
        vm.expectRevert(
            abi.encodeWithSelector(
                SliceOutOfBounds.selector,
                file.slices[0].pointer,
                0,
                file.slices[0].size,
                file.slices[0].offset
            )
        );
        file.read();
    }
}
