// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import {File, BytecodeSlice} from "./File.sol";
import {IContentStore} from "./IContentStore.sol";

/// @title EthFS FileStore interface
/// @notice Specifies a content-addressable onchain file store
interface IFileStore {
    /// @dev Emitted when a new file is created
    /// @param indexedFilename The indexed filename for easier finding by filename in logs
    /// @param pointer The pointer address of the file
    /// @param filename The name of the file
    /// @param size The total size of the file
    /// @param metadata Additional metadata of the file, only emitted for use in offchain indexers
    event FileCreated(
        string indexed indexedFilename,
        address indexed pointer,
        string filename,
        uint256 size,
        bytes metadata
    );

    /// @dev Error thrown when a requested file is not found
    /// @param filename The name of the file requested
    error FileNotFound(string filename);

    /// @dev Error thrown when a filename already exists
    /// @param filename The name of the file attempted to be created
    error FilenameExists(string filename);

    /// @dev Error thrown when attempting to create an empty file
    error FileEmpty();

    /// @dev Error thrown when a provided slice for a file is empty
    /// @param pointer The address of the content
    /// @param size The size of the slice
    /// @param offset The byte offset of the slice within the content
    error SliceEmpty(address pointer, uint32 size, uint32 offset);

    /// @dev Error thrown when the provided pointer's bytecode does not have the expected STOP opcode prefix from SSTORE2
    /// @param pointer The SSTORE2 pointer address
    error InvalidPointer(address pointer);

    /// @notice Returns the associated ContentStore contract used by this FileStore
    /// @return The ContentStore contract instance
    function contentStore() external view returns (IContentStore);

    /// @notice Retrieves the pointer address of a file by its filename
    /// @param filename The name of the file
    /// @return pointer The pointer address of the file
    function files(
        string memory filename
    ) external view returns (address pointer);

    /// @notice Checks if a file exists for a given filename
    /// @param filename The name of the file to check
    /// @return True if the file exists, false otherwise
    function fileExists(string memory filename) external view returns (bool);

    /// @notice Retrieves the pointer address for a given filename
    /// @param filename The name of the file
    /// @return pointer The pointer address of the file
    function getPointer(
        string memory filename
    ) external view returns (address pointer);

    /// @notice Retrieves a file by its filename
    /// @param filename The name of the file
    /// @return file The file associated with the filename
    function getFile(
        string memory filename
    ) external view returns (File memory file);

    /// @notice Creates a new file with the provided file contents
    /// @dev This is a convenience method to simplify small file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular method splits `contents` into 24575-byte chunks before storing them via SSTORE2.
    /// @param filename The name of the new file
    /// @param contents The contents of the file
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFile(
        string memory filename,
        string memory contents
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file with the provided file contents and file metadata
    /// @dev This is a convenience method to simplify small file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular method splits `contents` into 24575-byte chunks before storing them via SSTORE2.
    /// @param filename The name of the new file
    /// @param contents The contents of the file
    /// @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFile(
        string memory filename,
        string memory contents,
        bytes memory metadata
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file where its content is composed of the provided string chunks
    /// @dev This is a convenience method to simplify small and nuanced file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular will store each chunk separately via SSTORE2. For best gas efficiency, each chunk should be as large as possible (up to the contract size limit) and at least 32 bytes.
    /// @param filename The name of the new file
    /// @param chunks The string chunks composing the file
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFileFromChunks(
        string memory filename,
        string[] memory chunks
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file with the provided string chunks and file metadata
    /// @dev This is a convenience method to simplify small and nuanced file uploads. It's recommended to use `createFileFromPointers` or `createFileFromSlices` for larger files. This particular will store each chunk separately via SSTORE2. For best gas efficiency, each chunk should be as large as possible (up to the contract size limit) and at least 32 bytes.
    /// @param filename The name of the new file
    /// @param chunks The string chunks composing the file
    /// @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFileFromChunks(
        string memory filename,
        string[] memory chunks,
        bytes memory metadata
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file where its content is composed of the provided SSTORE2 pointers
    /// @param filename The name of the new file
    /// @param pointers The SSTORE2 pointers composing the file
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFileFromPointers(
        string memory filename,
        address[] memory pointers
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file with the provided SSTORE2 pointers and file metadata
    /// @param filename The name of the new file
    /// @param pointers The SSTORE2 pointers composing the file
    /// @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFileFromPointers(
        string memory filename,
        address[] memory pointers,
        bytes memory metadata
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file where its content is composed of the provided bytecode slices
    /// @param filename The name of the new file
    /// @param slices The bytecode slices composing the file
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFileFromSlices(
        string memory filename,
        BytecodeSlice[] memory slices
    ) external returns (address pointer, File memory file);

    /// @notice Creates a new file with the provided bytecode slices and file metadata
    /// @param filename The name of the new file
    /// @param slices The bytecode slices composing the file
    /// @param metadata Additional file metadata, usually a JSON-encoded string, for offchain indexers
    /// @return pointer The pointer address of the new file
    /// @return file The newly created file
    function createFileFromSlices(
        string memory filename,
        BytecodeSlice[] memory slices,
        bytes memory metadata
    ) external returns (address pointer, File memory file);

    /// @notice Convenience method for reading files in frontends and indexers where libraries are not accessible.
    /// @dev Contracts should use `File.read()` directly, rather than this method. Otherwise you will incur unnecessary gas for passing around large byte blobs.
    /// @param filename The name of the file to read
    /// @return contents The contents of the file
    function readFile(
        string memory filename
    ) external view returns (string memory contents);
}
