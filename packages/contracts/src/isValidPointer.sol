// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

function isValidPointer(address pointer) view returns (bool isValid) {
    // The assembly below is equivalent to
    //
    //   pointer.code.length >= 1 && pointer.code[0] == 0x00;
    //
    // but less gas because it doesn't have to load all the pointer's bytecode

    assembly {
        // Get the size of the bytecode at pointer
        let size := extcodesize(pointer)

        // Initialize first byte with INVALID opcode
        let firstByte := 0xfe

        // If there's at least one byte of code, copy the first byte
        if gt(size, 0) {
            // Allocate memory for the first byte
            let code := mload(0x40)

            // Copy the first byte of the code
            extcodecopy(pointer, code, 0, 1)

            // Retrieve the first byte, ensuring it's a single byte
            firstByte := and(mload(sub(code, 31)), 0xff)
        }

        // Check if the first byte is 0x00 (STOP opcode)
        isValid := eq(firstByte, 0x00)
    }
}
