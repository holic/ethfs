// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {ContentStore} from "../src/ContentStore.sol";

contract ContentStoreTest is Test {
    IContentStore public contentStore;

    event NewChecksum(bytes32 indexed checksum, uint256 contentSize);

    function setUp() public {
        contentStore = new ContentStore();
    }

    function testAddContent() public {
        bytes memory content = bytes(
            vm.readFile("packages/contracts/test/files/sstore2-max.txt")
        );
        bytes32 checksum = keccak256(content);

        assertFalse(
            contentStore.checksumExists(checksum),
            "expected checksum to not exist"
        );

        vm.expectEmit(true, true, true, true);
        emit NewChecksum(checksum, content.length);

        (bytes32 checksumResult, ) = contentStore.addContent(content);
        assertEq(checksumResult, checksum);

        // Adding the same content is a no-op
        (checksumResult, ) = contentStore.addContent(content);
        assertEq(checksumResult, checksum);

        assertTrue(
            contentStore.checksumExists(checksum),
            "expected checksum to exist"
        );

        bytes memory storedContent = SSTORE2.read(
            contentStore.getPointer(checksum)
        );

        assertEq(storedContent, content, "expected content to match");
        assertEq(
            keccak256(storedContent),
            checksum,
            "expected checksums to match"
        );
        assertEq(contentStore.contentLength(checksum), content.length);
    }

    function testAddPointer() public {
        bytes memory content = bytes(
            vm.readFile("packages/contracts/test/files/sstore2-max.txt")
        );
        bytes32 checksum = keccak256(content);
        address pointer = SSTORE2.write(content);

        assertFalse(
            contentStore.checksumExists(checksum),
            "expected checksum to not exist"
        );

        vm.expectEmit(true, true, true, true);
        emit NewChecksum(checksum, content.length);

        bytes32 checksumResult = contentStore.addPointer(pointer);
        assertEq(checksumResult, checksum);

        // Adding the same pointer is a no-op
        checksumResult = contentStore.addPointer(pointer);
        assertEq(checksumResult, checksum);

        assertEq(contentStore.contentLength(checksum), content.length);
    }

    function testGetPointer() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ChecksumNotFound.selector,
                keccak256("non-existent")
            )
        );
        contentStore.getPointer(keccak256("non-existent"));
    }

    function testContentLength() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ChecksumNotFound.selector,
                keccak256("non-existent")
            )
        );
        contentStore.contentLength(keccak256("non-existent"));
    }
}
