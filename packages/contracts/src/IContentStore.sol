// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

/// @title EthFS ContentStore interface
/// @notice This interface defines the functions for a content-addressable storage contract. Using SSTORE2 and Safe's Singleton Factory, content is written to its content-derived deterministic address.
interface IContentStore {
    /// @dev Emitted when new content is added
    /// @param pointer The deterministic address of the content
    /// @param size The size of the content in bytes
    event NewContent(address indexed pointer, uint32 size);

    /// @dev Error thrown when content is not found in the store
    /// @param pointer The address of the content queried
    error ContentNotFound(address pointer);

    /// @dev Error thrown when the pointer of the content added does not match the one we compute from the content, signaling something weird going on with the deployer
    /// @param expectedPointer The expected address of the content
    /// @param actualPointer The actual address of the content
    error UnexpectedPointer(address expectedPointer, address actualPointer);

    /// @notice Checks if content exists at a given pointer address
    /// @param pointer The address of the content
    /// @return True if content exists, false otherwise
    function pointerExists(address pointer) external view returns (bool);

    /// @notice Get the length of the content stored at a specific pointer
    /// @param pointer The address of the content
    /// @return size The size of the content in bytes
    function contentLength(address pointer) external view returns (uint32 size);

    /// @notice Computes the deterministic pointer for given content
    /// @param content The content to compute the address for
    /// @return pointer The computed address of the content
    function getPointer(bytes memory content) external view returns (address);

    /// @notice Store content and return its address pointer
    /// @param content The content to store
    /// @return pointer The address where the content is stored
    function addContent(
        bytes memory content
    ) external returns (address pointer);

    /// @notice Convenience method for getting content in frontends and indexers where libraries are not accessible.
    /// @dev Contracts should use `SSTORE2.read()` directly, rather than this method. Otherwise you will incur unnecessary gas for passing around large byte blobs.
    /// @param pointer The address of the content to retrieve
    /// @return content The content stored at the pointer address
    function getContent(
        address pointer
    ) external returns (bytes memory content);
}
