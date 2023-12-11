// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IFileStore} from "./IFileStore.sol";
import {Ownable2Step} from "openzeppelin/access/Ownable2Step.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";
import {File, BytecodeSlice} from "./File.sol";
import {IContentStore} from "./IContentStore.sol";

contract FileStore is IFileStore, Ownable2Step {
    IContentStore public immutable contentStore;

    // filename => File pointer
    mapping(string => address) public files;

    constructor(IContentStore _contentStore) Ownable(msg.sender) {
        contentStore = _contentStore;
    }

    function fileExists(string memory filename) public view returns (bool) {
        return files[filename] != address(0);
    }

    function getPointer(
        string memory filename
    ) public view returns (address pointer) {
        pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return pointer;
    }

    function getFile(
        string memory filename
    ) public view returns (File memory file) {
        address pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return abi.decode(SSTORE2.read(pointer), (File));
    }

    function createFile(
        string memory filename,
        BytecodeSlice[] memory slices
    ) public returns (address pointer, File memory file) {
        return createFile(filename, slices, new bytes(0));
    }

    function createFile(
        string memory filename,
        BytecodeSlice[] memory slices,
        bytes memory metadata
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, slices, metadata);
    }

    function _createFile(
        string memory filename,
        BytecodeSlice[] memory slices,
        bytes memory metadata
    ) internal returns (address pointer, File memory file) {
        if (files[filename] != address(0)) {
            revert FilenameExists(filename);
        }
        uint256 size = 0;
        for (uint256 i = 0; i < slices.length; ++i) {
            if (slices[i].size == 0) {
                revert SliceEmpty(slices[i]);
            }
            uint32 codeSize = _getCodeSize(slices[i].pointer);
            if (slices[i].offset + slices[i].size > codeSize) {
                revert SliceOutOfBounds(slices[i]);
            }
            size += slices[i].size;
        }
        if (size == 0) {
            revert FileEmpty();
        }
        file = File({size: size, slices: slices});
        pointer = contentStore.addContent(abi.encode(file));
        files[filename] = pointer;
        emit FileCreated(filename, pointer, filename, file.size, metadata);
    }

    function deleteFile(string memory filename) public onlyOwner {
        address pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        delete files[filename];
        emit FileDeleted(filename, pointer, filename);
    }

    function _getCodeSize(address target) internal view returns (uint32 size) {
        assembly {
            size := extcodesize(target)
        }
    }
}
