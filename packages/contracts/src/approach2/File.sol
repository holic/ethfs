// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

struct Content {
    bytes32 checksum;
    address pointer;
}

struct File {
    uint256 size; // content length in bytes, max 24k
    Content[] contents;
}
