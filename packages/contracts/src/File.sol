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

function read(File memory file) view returns (string memory contents) {
    BytecodeSlice[] memory slices = file.slices;

    assembly {
        let len := mload(slices)
        let totalSize := 0x20
        contents := mload(0x40)
        let sliceSize
        let slice
        let pointer
        let offset

        // loop through all slices
        // - get pointer
        // - get size
        // - get offset
        // - get code and add to contents
        // - update total size

        for {
            let i := 0
        } lt(i, len) {
            i := add(i, 1)
        } {
            slice := mload(add(slices, add(0x20, mul(i, 0x20))))
            pointer := mload(slice)
            sliceSize := mload(add(slice, 0x20))
            offset := mload(add(slice, 0x40))

            extcodecopy(
                pointer,
                add(contents, totalSize),
                // TODO: remove +1 once we write this as part of the slice
                add(offset, 1),
                sliceSize
            )
            totalSize := add(totalSize, sliceSize)
        }

        // update contents size
        mstore(contents, sub(totalSize, 0x20))
        // store contents
        mstore(0x40, add(contents, and(add(totalSize, 0x1f), not(0x1f))))
    }
}

using {read} for File global;
