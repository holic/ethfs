// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {LibString} from "solady/utils/LibString.sol";
import {IFileStore} from "./IFileStore.sol";
import {File, BytecodeSlice, SliceOutOfBounds} from "./File.sol";
import {addContent, isValidPointer} from "./common.sol";

/**
 * @title EthFS FileStore
 * @notice Content-addressable file storage for Ethereum. Files are composed of slices of contract bytecode, the most efficient way to store and retrieve data onchain.
 */
contract FileStore is IFileStore {
    /**
     * @dev The address of the CREATE2 deterministic deployer
     */
    address public immutable deployer;

    /**
     * @dev Mapping of filenames to their respective SSTORE2 pointer where the ABI-encoded File lives
     */
    mapping(string filename => address pointer) public files;

    /**
     *
     * @param _deployer The address of the deterministic CREATE2 deployer
     */
    constructor(address _deployer) {
        deployer = _deployer;
        emit Deployed();
    }

    /**
     * @notice Checks if a file exists for a given filename
     * @param filename The name of the file to check
     * @return True if the file exists, false otherwise
     */
    function fileExists(string memory filename) public view returns (bool) {
        return files[filename] != address(0);
    }

    /**
     * @notice Retrieves the pointer address for a given filename
     * @param filename The name of the file
     * @return pointer The pointer address of the file
     */
    function getPointer(
        string memory filename
    ) public view returns (address pointer) {
        pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return pointer;
    }

    /**
     * @notice Retrieves a file by its filename
     * @param filename The name of the file
     * @return file The file associated with the filename
     */
    function getFile(
        string memory filename
    ) public view returns (File memory file) {
        address pointer = files[filename];
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return abi.decode(SSTORE2.read(pointer), (File));
    }

    /**
     * @notice Creates a new file with the provided file contents
     * @dev This is a convenience method to simplify small file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular method splits `contents` into 24575-byte chunks before storing them via SSTORE2.
     * @param filename The name of the new file
     * @param contents The contents of the file
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFile(
        string memory filename,
        string memory contents
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromContents(contents), new bytes(0));
    }

    /**
     * @notice Creates a new file with the provided file contents and file metadata
     * @dev This is a convenience method to simplify small file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular method splits `contents` into 24575-byte chunks before storing them via SSTORE2.
     * @param filename The name of the new file
     * @param contents The contents of the file
     * @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFile(
        string memory filename,
        string memory contents,
        bytes memory metadata
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromContents(contents), metadata);
    }

    /**
     * @notice Creates a new file where its content is composed of the provided string chunks
     * @dev This is a convenience method to simplify small and nuanced file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular will store each chunk separately via SSTORE2. For best gas efficiency, each chunk should be as large as possible (up to the contract size limit) and at least 32 bytes.
     * @param filename The name of the new file
     * @param chunks The string chunks composing the file
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFileFromChunks(
        string memory filename,
        string[] memory chunks
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromChunks(chunks), new bytes(0));
    }

    /**
     * @notice Creates a new file with the provided string chunks and file metadata
     * @dev This is a convenience method to simplify small and nuanced file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular will store each chunk separately via SSTORE2. For best gas efficiency, each chunk should be as large as possible (up to the contract size limit) and at least 32 bytes.
     * @param filename The name of the new file
     * @param chunks The string chunks composing the file
     * @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFileFromChunks(
        string memory filename,
        string[] memory chunks,
        bytes memory metadata
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromChunks(chunks), metadata);
    }

    /**
     * @notice Creates a new file where its content is composed of the provided SSTORE2 pointers
     * @param filename The name of the new file
     * @param pointers The SSTORE2 pointers composing the file
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFileFromPointers(
        string memory filename,
        address[] memory pointers
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromPointers(pointers), new bytes(0));
    }

    /**
     * @notice Creates a new file with the provided SSTORE2 pointers and file metadata
     * @param filename The name of the new file
     * @param pointers The SSTORE2 pointers composing the file
     * @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFileFromPointers(
        string memory filename,
        address[] memory pointers,
        bytes memory metadata
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromPointers(pointers), metadata);
    }

    /**
     * @notice Creates a new file where its content is composed of the provided bytecode slices
     * @param filename The name of the new file
     * @param slices The bytecode slices composing the file
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFileFromSlices(
        string memory filename,
        BytecodeSlice[] memory slices
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromSlices(slices), new bytes(0));
    }

    /**
     * @notice Creates a new file with the provided bytecode slices and file metadata
     * @param filename The name of the new file
     * @param slices The bytecode slices composing the file
     * @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
     * @return pointer The pointer address of the new file
     * @return file The newly created file
     */
    function createFileFromSlices(
        string memory filename,
        BytecodeSlice[] memory slices,
        bytes memory metadata
    ) public returns (address pointer, File memory file) {
        return _createFile(filename, _fileFromSlices(slices), metadata);
    }

    /**
     * @dev Internal function for preparing a file from its contents
     */
    function _fileFromContents(
        string memory contents
    ) internal returns (File memory file) {
        uint256 size = bytes(contents).length;
        uint256 chunkSize = 0x6000 - 1;
        uint256 numChunks = (size + chunkSize - 1) / chunkSize;
        string[] memory chunks = new string[](numChunks);
        for (uint256 i = 0; i < numChunks; ++i) {
            uint256 start = i * chunkSize;
            uint256 end = start + chunkSize > size ? size : start + chunkSize;
            chunks[i] = LibString.slice(contents, start, end);
        }
        return _fileFromChunks(chunks);
    }

    /**
     * @dev Internal function for preparing a file from its chunks
     */
    function _fileFromChunks(
        string[] memory chunks
    ) internal returns (File memory file) {
        uint256 size = 0;
        BytecodeSlice[] memory slices = new BytecodeSlice[](chunks.length);
        for (uint256 i = 0; i < chunks.length; ++i) {
            slices[i].pointer = addContent(deployer, bytes(chunks[i]));
            slices[i].start = uint32(SSTORE2.DATA_OFFSET);
            slices[i].end = uint32(
                SSTORE2.DATA_OFFSET + bytes(chunks[i]).length
            );
            size += slices[i].end - slices[i].start;
        }
        return File({size: size, slices: slices});
    }

    /**
     * @dev Internal function for preparing a file from its pointers
     */
    function _fileFromPointers(
        address[] memory pointers
    ) internal view returns (File memory file) {
        uint256 size = 0;
        BytecodeSlice[] memory slices = new BytecodeSlice[](pointers.length);
        for (uint256 i = 0; i < pointers.length; ++i) {
            if (!isValidPointer(pointers[i])) {
                revert InvalidPointer(pointers[i]);
            }
            slices[i].pointer = pointers[i];
            slices[i].start = uint32(SSTORE2.DATA_OFFSET);
            slices[i].end = uint32(pointers[i].code.length);
            size += slices[i].end - slices[i].start;
        }
        return File({size: size, slices: slices});
    }

    /**
     * @dev Internal function for preparing a file from its slices
     */
    function _fileFromSlices(
        BytecodeSlice[] memory slices
    ) internal view returns (File memory file) {
        uint256 size = 0;
        for (uint256 i = 0; i < slices.length; ++i) {
            if (slices[i].end - slices[i].start <= 0) {
                revert SliceEmpty(
                    slices[i].pointer,
                    slices[i].start,
                    slices[i].end
                );
            }
            uint32 codeSize = uint32(slices[i].pointer.code.length);
            if (slices[i].end > codeSize) {
                revert SliceOutOfBounds(
                    slices[i].pointer,
                    codeSize,
                    slices[i].start,
                    slices[i].end
                );
            }
            size += slices[i].end - slices[i].start;
        }
        return File({size: size, slices: slices});
    }

    /**
     * @dev Internal function for creating a file
     */
    function _createFile(
        string memory filename,
        File memory file,
        bytes memory metadata
    ) internal returns (address pointer, File memory) {
        if (file.size == 0) {
            revert FileEmpty();
        }
        if (files[filename] != address(0)) {
            revert FilenameExists(filename);
        }
        pointer = addContent(deployer, abi.encode(file));
        files[filename] = pointer;
        emit FileCreated(filename, pointer, filename, file.size, metadata);
        return (pointer, file);
    }

    /*
        Convenience methods for frontends and indexers
    */

    /**
     * @notice Convenience method for reading files in frontends and indexers where libraries are not accessible.
     * @dev Contracts should use `File.read()` directly, rather than this method. Otherwise you will incur unnecessary gas for passing around large byte blobs.
     * @param filename The name of the file to read
     * @return contents The contents of the file
     */
    function readFile(
        string memory filename
    ) public view returns (string memory contents) {
        return getFile(filename).read();
    }
}
