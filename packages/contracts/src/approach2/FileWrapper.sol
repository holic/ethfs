// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {ContentStoreRegistry, ContentStore} from "./ContentStoreRegistry.sol";
import {IFileWrapper} from "./IFileWrapper.sol";

contract FileWrapper is IFileWrapper {
    uint256 public size;
    address[] public pointers;
    uint256 public pointersLength;

    error EmptyFile();

    constructor(bytes32[] memory checksums) {
        pointersLength = checksums.length;
        ContentStore contentStore = ContentStoreRegistry.getStore();
        for (uint256 i = 0; i < checksums.length; i++) {
            size += contentStore.contentLength(checksums[i]);
            pointers.push(contentStore.getPointer(checksums[i]));
        }
        if (size == 0) {
            revert EmptyFile();
        }
    }

    function read() public view returns (bytes memory data) {
        data = DynamicBuffer.allocate(size);
        for (uint256 i = 0; i < pointers.length; i++) {
            DynamicBuffer.appendSafe(data, SSTORE2.read(pointers[i]));
        }
        return data;
    }

    function allPointers() public view returns (address[] memory) {
        return pointers;
    }
}
