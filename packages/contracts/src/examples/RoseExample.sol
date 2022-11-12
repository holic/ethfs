// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC721} from "openzeppelin/token/ERC721/ERC721.sol";
import {IFileStore} from "../IFileStore.sol";

// A demonstration of dhof's 3D rose token using FileStore as a backend for the heavy, reusable assets
// https://opensea.io/assets/ethereum/0x3e743377417cd7ca70dcc9bf08fac55664ed3181/1

contract RoseExample is ERC721 {
    IFileStore public immutable fileStore;

    constructor(IFileStore _fileStore) ERC721("RoseExample", "ROSE") {
        fileStore = _fileStore;
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
        _mint(msg.sender, 3);
        _mint(msg.sender, 4);
    }

    function toString(uint256 value) internal pure returns (string memory str) {
        /// @solidity memory-safe-assembly
        assembly {
            // The maximum value of a uint256 contains 78 digits (1 byte per digit), but we allocate 160 bytes
            // to keep the free memory pointer word aligned. We'll need 1 word for the length, 1 word for the
            // trailing zeros padding, and 3 other words for a max of 78 digits. In total: 5 * 32 = 160 bytes.
            let newFreeMemoryPointer := add(mload(0x40), 160)

            // Update the free memory pointer to avoid overriding our string.
            mstore(0x40, newFreeMemoryPointer)

            // Assign str to the end of the zone of newly allocated memory.
            str := sub(newFreeMemoryPointer, 32)

            // Clean the last word of memory it may not be overwritten.
            mstore(str, 0)

            // Cache the end of the memory to calculate the length later.
            let end := str

            // We write the string from rightmost digit to leftmost digit.
            // The following is essentially a do-while loop that also handles the zero case.
            // prettier-ignore
            for { let temp := value } 1 {} {
                // Move the pointer 1 byte to the left.
                str := sub(str, 1)

                // Write the character to the pointer.
                // The ASCII index of the '0' character is 48.
                mstore8(str, add(48, mod(temp, 10)))

                // Keep dividing temp until zero.
                temp := div(temp, 10)

                 // prettier-ignore
                if iszero(temp) { break }
            }

            // Compute and cache the final total length of the string.
            let length := sub(end, str)

            // Move the pointer 32 bytes leftwards to make room for the length.
            str := sub(str, 32)

            // Store the string's length at the start of memory allocated for our string.
            mstore(str, length)
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return
            string.concat(
                "data:application/json,%7B%22name%22%3A%22Example%20Rose%22%2C%22animation_url%22%3A%22data%3Atext%2Fhtml%2C%253Cscript%250A%2520%2520type%253D%2522text%252Fjavascript%252Bgzip%2522%250A%2520%2520src%253D%2522data%253Atext%252Fjavascript%253Bbase64%252C",
                fileStore.getFile("three.min.js.gz").read(),
                "%2522%250A%253E%253C%252Fscript%253E%250A%253Cscript%2520src%253D%2522data%253Atext%252Fjavascript%253Bbase64%252C",
                fileStore.getFile("gunzipScripts.js").read(),
                "%2522%253E%253C%252Fscript%253E%250A%250A%253Cscript%253E%250A%2520%2520var%2520tokenId%2520%253D%2520",
                toString(tokenId),
                "%253B%250A%253C%252Fscript%253E%250A%253Cstyle%253E%250A%2520%2520*%2520%257B%250A%2520%2520%2520%2520margin%253A%25200%253B%250A%2520%2520%2520%2520padding%253A%25200%253B%250A%2520%2520%257D%250A%2520%2520canvas%2520%257B%250A%2520%2520%2520%2520width%253A%2520100%2525%253B%250A%2520%2520%2520%2520height%253A%2520100%2525%253B%250A%2520%2520%257D%250A%253C%252Fstyle%253E%250A%253Cscript%2520src%253D%2522data%253Atext%252Fjavascript%253Bbase64%252C",
                fileStore.getFile("rose.js").read(),
                "%2522%253E%253C%252Fscript%253E%250A%22%7D"
            );
    }
}
