// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {ContentStoreRegistry, ContentStore} from "./ContentStoreRegistry.sol";
import {IFileWrapper} from "./IFileWrapper.sol";

contract FileWrapperChunk4 is IFileWrapper {
    uint256 public size;
    address public pointer0;
    address public pointer1;
    address public pointer2;
    address public pointer3;

    error EmptyFile();

    constructor(bytes32[] memory checksums) {
        ContentStore contentStore = ContentStoreRegistry.getStore();
        size += contentStore.contentLength(checksums[0]);
        pointer0 = contentStore.getPointer(checksums[0]);
        size += contentStore.contentLength(checksums[1]);
        pointer1 = contentStore.getPointer(checksums[1]);
        size += contentStore.contentLength(checksums[2]);
        pointer2 = contentStore.getPointer(checksums[2]);
        size += contentStore.contentLength(checksums[3]);
        pointer3 = contentStore.getPointer(checksums[3]);
        if (size == 0) {
            revert EmptyFile();
        }
    }

    function read() public view returns (bytes memory data) {
        data = DynamicBuffer.allocate(size);
        DynamicBuffer.appendSafe(data, SSTORE2.read(pointer0));
        DynamicBuffer.appendSafe(data, SSTORE2.read(pointer1));
        DynamicBuffer.appendSafe(data, SSTORE2.read(pointer2));
        DynamicBuffer.appendSafe(data, SSTORE2.read(pointer3));
        return data;
    }

    function allPointers() public view returns (address[] memory) {
        address[] memory pointers = new address[](4);
        pointers[0] = pointer0;
        pointers[1] = pointer1;
        pointers[2] = pointer2;
        pointers[3] = pointer3;
        return pointers;
    }
}
