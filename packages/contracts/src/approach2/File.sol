// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

struct File {
    uint256 size; // content length in bytes, max 24k
    bytes32[] checksums;
}
