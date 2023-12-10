// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";

struct ContentSlice {
    address pointer;
    // content can only be 24kb, which is <65k (max value of uint16)
    uint16 start; // inclusive
    uint16 end; // exclusive
}

struct File {
    uint256 size;
    ContentSlice[] slices;
}

function read(File memory file) view returns (string memory) {
    ContentSlice[] memory slices = file.slices;

    // TODO: rewrite this in assembly?
    bytes memory buffer = DynamicBuffer.allocate(file.size);
    for (uint256 i = 0; i < slices.length; i++) {
        DynamicBuffer.appendUnchecked(
            buffer,
            SSTORE2.read(slices[i].pointer, slices[i].start, slices[i].end)
        );
    }

    return string(buffer);
}

using {read} for File global;
