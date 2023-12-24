// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

/// @title EthFS File
/// @notice A representation of an onchain file, composed of slices of contract bytecode and utilities to construct the file contents from those slices.
/// @dev For best gas efficiency, it's recommended using `File.read()` as close to the output returned by the contract call as possible. Lots of gas is consumed every time a large data blob is passed between functions.

/// @dev Represents a reference to a slice of bytecode in a contract
struct BytecodeSlice {
    address pointer;
    uint32 size;
    uint32 offset;
}

/// @dev Represents a file composed of one or more bytecode slices
struct File {
    /// @dev Total length of file contents (sum of all slice sizes). Useful when you want to use DynamicBuffer to build the file contents from the slices.
    uint256 size;
    BytecodeSlice[] slices;
}
// extend File struct with read functions
using {read} for File global;
using {readUnchecked} for File global;

/// @dev Error thrown when a slice is out of the bounds of the contract's bytecode
error SliceOutOfBounds(
    address pointer,
    uint32 codeSize,
    uint32 sliceSize,
    uint32 sliceOffset
);

/// @notice Reads the contents of a file by concatenating its slices
/// @param file The file to read
/// @return contents The concatenated contents of the file
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

/// @notice Reads the contents of a file without reverting on unreadable/invalid slices. Skips any slices that are out of bounds or invalid. Useful if you are composing contract bytecode where a contract can still selfdestruct (which would result in an invalid slice) and want to avoid reverts but still output potentially "corrupted" file contents (due to missing data).
/// @param file The file to read
/// @return contents The concatenated contents of the file, skipping invalid slices
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
