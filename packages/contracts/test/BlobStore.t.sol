// SPDX-License-Identifier: CC0-1.0
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "../src/BlobStore.sol";

contract BlobStoreTest is Test {
    BlobStore private blobStore;

    error FileDoesNotExist(string filename);

    function setUp() public {
        blobStore = new BlobStore();
    }

    function testWrite() public {
        bytes memory blob = bytes(
            vm.readFile("packages/contracts/test/blobs/three.min.js")
        );
        // console.log("blob bytes", blob.length);
        bytes32 checksum = keccak256(blob);

        assertFalse(
            blobStore.checksumExists(checksum),
            "expected checksum to not exist"
        );
        // TODO: why does this not fail? its way over 24kb
        blobStore.write(blob);
        assertTrue(
            blobStore.checksumExists(checksum),
            "expected checksum to exist"
        );

        bytes memory storedBlob = blobStore.read(checksum);
        assertEq(blob, storedBlob, "expected blobs to be equal");
        assertEq(
            checksum,
            keccak256(storedBlob),
            "expected checksums to match"
        );
    }
}
