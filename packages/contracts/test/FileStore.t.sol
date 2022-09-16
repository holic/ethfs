// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "../src/FileStore.sol";

contract FileStoreTest is Test {
    FileStore private fileStore;

    error FileDoesNotExist(string filename);

    function setUp() public {
        fileStore = new FileStore();
    }

    function slice(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) public pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function testWrite() public {
        // bytes memory data = bytes(
        //     slice(
        //         vm.readFile("packages/contracts/test/files/three.min.js"),
        //         0,
        //         3000
        //     )
        // );
        bytes memory data = bytes(
            vm.readFile("packages/contracts/test/files/2b.txt")
        );
        bytes32 checksum = keccak256(data);

        assertFalse(
            fileStore.checksumExists(checksum),
            "expected checksum to not exist"
        );
        // TODO: why does this not fail? its way over 24kb
        fileStore.writeChunk(data);
        assertTrue(
            fileStore.checksumExists(checksum),
            "expected checksum to exist"
        );

        bytes memory storedChunk = fileStore.readChunk(checksum);
        assertEq(data, storedChunk, "expected data to match");
        assertEq(
            checksum,
            keccak256(storedChunk),
            "expected checksums to match"
        );

        // TODO: figure out how to tell forge to limit this at write time
        emit log_named_uint("chunk size", fileStore.chunkSize(checksum));
        emit log_named_uint("data size", storedChunk.length);
        assertTrue(
            fileStore.chunkSize(checksum) <= 24576,
            "sstore2 write exceeds maximum contract size"
        );
    }
}
