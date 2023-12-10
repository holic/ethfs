// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";

struct BytecodeSlice {
    address pointer;
    uint32 size;
    uint32 offset;
}

struct File {
    uint256 size;
    BytecodeSlice[] slices;
}

function read(File memory file) view returns (string memory) {
    BytecodeSlice[] memory slices = file.slices;

    // TODO: rewrite this in assembly?
    bytes memory buffer = DynamicBuffer.allocate(file.size);
    for (uint256 i = 0; i < slices.length; i++) {
        DynamicBuffer.appendUnchecked(
            buffer,
            SSTORE2.read(
                slices[i].pointer,
                slices[i].offset,
                slices[i].offset + slices[i].size
            )
        );
    }

    return string(buffer);
}

using {read} for File global;
