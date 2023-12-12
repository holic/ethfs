// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IFileStore} from "./IFileStore.sol";
import {File, BytecodeSlice, SliceOutOfBounds} from "./File.sol";
import {IContentStore} from "./IContentStore.sol";
import {getCodeSize} from "./getCodeSize.sol";

/// @title EthFS FileStore
/// @notice Content-addressable file storage for Ethereum. Files are composed of slices of bytecode.
contract FileStore is IFileStore {
    /// @notice The ContentStore used to cheaply store encoded file pointers
    IContentStore public immutable contentStore;

    /// @dev Mapping of filenames to their respective storage pointers
    mapping(string filename => address pointer) public files;

    /// @notice Constructor that sets the associated ContentStore address
    /// @param _contentStore The address of the ContentStore contract
    constructor(IContentStore _contentStore) {
        contentStore = _contentStore;
    }

    /// @notice Checks if a file exists for a given filename
    /// @param filename The name of the file to check
    /// @return True if the file exists, false otherwise
    function fileExists(string memory filename) public view returns (bool) {
        return files[filename] != address(0);
    }

    /// @notice Retrieves the pointer address for a given filename
    /// @param filename The name of the file
    /// @return pointer The pointer address of the file
    function getPointer(
        string memory filename
    ) public view returns (address pointer) {
        pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return pointer;
    }

    /// @notice Retrieves a file by its filename
    /// @param filename The name of the file
    /// @return file The file associated with the filename
    function getFile(
        string memory filename
    ) public view returns (File memory file) {
        address pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return abi.decode(SSTORE2.read(pointer), (File));
    }

    /// @notice Creates a new file where its content is composed of the provided slices
    /// @param filename The name of the new file
    /// @param slices The bytecode slices composing the file
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFile(
        string memory filename,
        BytecodeSlice[] memory slices
    ) public returns (address pointer, File memory file) {
        return createFile(filename, slices, new bytes(0));
    }

    /// @notice Creates a new file with the provided slices and metadata
    /// @param filename The name of the new file
    /// @param slices The bytecode slices composing the file
    /// @param metadata Additional metadata for the file
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFile(
        string memory filename,
        BytecodeSlice[] memory slices,
        bytes memory metadata
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, slices, metadata);
    }

    /// @dev Internal function for creating a file and validating its slices
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
                revert SliceEmpty(
                    slices[i].pointer,
                    slices[i].size,
                    slices[i].offset
                );
            }
            uint32 codeSize = getCodeSize(slices[i].pointer);
            if (slices[i].offset + slices[i].size > codeSize) {
                revert SliceOutOfBounds(
                    slices[i].pointer,
                    codeSize,
                    slices[i].size,
                    slices[i].offset
                );
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

    /// @notice Convenience method for reading files in frontends and indexers where libraries are not accessible.
    /// @dev Contracts should use `File.read()` directly, rather than this method. Otherwise you will incur unnecessary gas for passing around large byte blobs.
    /// @param filename The name of the file to read
    /// @return contents The contents of the file
    function readFile(
        string memory filename
    ) public view returns (string memory contents) {
        return getFile(filename).read();
    }
}
