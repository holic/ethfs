// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";

struct Content {
    bytes32 checksum;
    address pointer;
}

struct File {
    uint256 size; // content length in bytes, max 24k
    Content[] contents;
}

function read(File memory file) view returns (string memory) {
    bytes memory data = DynamicBuffer.allocate(file.size);
    for (uint256 i = 0; i < file.contents.length; i++) {
        DynamicBuffer.appendSafe(data, SSTORE2.read(file.contents[i].pointer));
    }
    return string(data);
}

using {
    read
} for File global;
