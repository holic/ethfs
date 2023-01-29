// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IContentStore {
    event NewChecksum(bytes32 indexed checksum, uint256 contentSize);

    error ChecksumExists(bytes32 checksum);
    error ChecksumNotFound(bytes32 checksum);

    function pointers(bytes32 checksum)
        external
        view
        returns (address pointer);

    function checksumExists(bytes32 checksum) external view returns (bool);

    function contentLength(bytes32 checksum)
        external
        view
        returns (uint256 size);

    function addPointer(address pointer) external returns (bytes32 checksum);

    function addContent(bytes memory content)
        external
        returns (bytes32 checksum, address pointer);

    function getPointer(bytes32 checksum)
        external
        view
        returns (address pointer);
}
