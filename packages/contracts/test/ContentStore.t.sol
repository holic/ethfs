// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {ContentStore} from "../src/ContentStore.sol";

contract ContentStoreTest is Test {
    event NewContent(address indexed pointer, uint32 contentSize);

    IContentStore public contentStore;

    function setUp() public {
        // TODO: set up deployer instead of using CREATE2_FACTORY
        contentStore = new ContentStore(
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );
    }

    function testAddContent() public {
        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        address pointer = contentStore.pointerForContent(content);

        assertEq(pointer, address(0x837618a80DB6d3590bfB6cadC239bc09e793C12D));
        assertFalse(
            contentStore.pointerExists(pointer),
            "expected checksum to not exist"
        );

        vm.expectEmit(true, true, true, true);
        emit NewContent(pointer, uint32(content.length));
        address newPointer = contentStore.addContent(content);
        assertEq(newPointer, pointer);

        // Adding the same content should revert
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ContentAlreadyExists.selector,
                pointer
            )
        );
        contentStore.addContent(content);

        assertTrue(
            contentStore.pointerExists(pointer),
            "expected pointer to exist"
        );

        bytes memory storedContent = SSTORE2.read(pointer);

        assertEq(storedContent, content, "expected content to match");
        assertEq(contentStore.contentLength(pointer), content.length);
    }

    function testContentLength() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ContentNotFound.selector,
                address(0)
            )
        );
        contentStore.contentLength(address(0));
    }

    function testGetContent() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ContentNotFound.selector,
                address(0)
            )
        );
        contentStore.getContent(address(0));
    }

    function testDeterministicPointer() public {
        bytes memory content = bytes(vm.readFile("test/files/sstore2-max.txt"));
        address pointer = contentStore.addContent(content);

        // TODO: set up deployer instead of using CREATE2_FACTORY
        ContentStore secondContentStore = new ContentStore(
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );

        vm.expectRevert(
            abi.encodeWithSelector(
                IContentStore.ContentAlreadyExists.selector,
                pointer
            )
        );
        secondContentStore.addContent(content);
    }
}
