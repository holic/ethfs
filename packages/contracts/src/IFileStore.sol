// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {File} from "./File.sol";

interface IFileStore {
    event FileCreated(
        string indexed filename,
        bytes32 indexed checksum,
        uint256 size,
        bytes metadata
    );
    event FileDeleted(string indexed filename);

    error FileNotFound(string filename);
    error FilenameExists(string filename);
    error EmptyFile();

    // TODO: expose storage getters

    function fileExists(string memory filename) external view returns (bool);

    function getChecksum(string memory filename)
        external
        view
        returns (bytes32 checksum);

    function getFile(string memory filename)
        external
        view
        returns (File memory file);

    function createFile(string memory filename, bytes32[] memory checksums)
        external
        returns (File memory file);

    function createFile(
        string memory filename,
        bytes32[] memory checksums,
        bytes memory metadata
    ) external returns (File memory file);

    function deleteFile(string memory filename) external;
}
