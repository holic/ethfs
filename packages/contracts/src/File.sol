// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

struct BytecodeSlice {
    address pointer;
    uint32 size;
    uint32 offset;
}

struct File {
    uint256 size;
    BytecodeSlice[] slices;
}

error SliceOutOfBounds(
    address pointer,
    uint32 codeSize,
    uint32 sliceSize,
    uint32 sliceOffset
);

function read(File memory file) view returns (string memory contents) {
    BytecodeSlice[] memory slices = file.slices;
    bytes4 sliceOutOfBoundsSelector = SliceOutOfBounds.selector;

    assembly {
        let len := mload(slices)
        let totalSize := 0x20
        contents := mload(0x40)
        let slice
        let pointer
        let size
        let offset
        let codeSize

        for {
            let i := 0
        } lt(i, len) {
            i := add(i, 1)
        } {
            slice := mload(add(slices, add(0x20, mul(i, 0x20))))
            pointer := mload(slice)
            size := mload(add(slice, 0x20))
            offset := mload(add(slice, 0x40))

            codeSize := extcodesize(pointer)
            if lt(codeSize, add(offset, size)) {
                mstore(0x00, sliceOutOfBoundsSelector)
                mstore(0x04, pointer)
                mstore(0x24, codeSize)
                mstore(0x44, size)
                mstore(0x64, offset)
                revert(0x00, 0x84)
            }

            extcodecopy(pointer, add(contents, totalSize), offset, size)
            totalSize := add(totalSize, size)
        }

        // update contents size
        mstore(contents, sub(totalSize, 0x20))
        // store contents
        mstore(0x40, add(contents, and(add(totalSize, 0x1f), not(0x1f))))
    }
}

// Same as `read` but doesn't revert on unreadable/invalid slices and instead just skips the slice
function readUnchecked(File memory file) view returns (string memory contents) {
    BytecodeSlice[] memory slices = file.slices;

    assembly {
        let len := mload(slices)
        let totalSize := 0x20
        contents := mload(0x40)
        let slice
        let pointer
        let size
        let offset
        let codeSize

        for {
            let i := 0
        } lt(i, len) {
            i := add(i, 1)
        } {
            slice := mload(add(slices, add(0x20, mul(i, 0x20))))
            pointer := mload(slice)
            size := mload(add(slice, 0x20))
            offset := mload(add(slice, 0x40))

            codeSize := extcodesize(pointer)
            if lt(add(offset, size), codeSize) {
                extcodecopy(pointer, add(contents, totalSize), offset, size)
                totalSize := add(totalSize, size)
            }
        }

        // update contents size
        mstore(contents, sub(totalSize, 0x20))
        // store contents
        mstore(0x40, add(contents, and(add(totalSize, 0x1f), not(0x1f))))
    }
}

using {read} for File global;
using {readUnchecked} for File global;
