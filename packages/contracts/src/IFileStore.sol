// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import {File, BytecodeSlice} from "./File.sol";
import {IContentStore} from "./IContentStore.sol";

interface IFileStore {
    event FileCreated(
        string indexed indexedFilename,
        address indexed pointer,
        string filename,
        uint256 size,
        bytes metadata
    );
    event FileDeleted(
        string indexed indexedFilename,
        address indexed pointer,
        string filename
    );

    error FileNotFound(string filename);
    error FilenameExists(string filename);
    error EmptyFile();

    function contentStore() external view returns (IContentStore);

    function files(
        string memory filename
    ) external view returns (address pointer);

    function fileExists(string memory filename) external view returns (bool);

    function getPointer(
        string memory filename
    ) external view returns (address pointer);

    function getFile(
        string memory filename
    ) external view returns (File memory file);

    function createFile(
        string memory filename,
        BytecodeSlice[] memory slices
    ) external returns (address pointer, File memory file);

    function createFile(
        string memory filename,
        BytecodeSlice[] memory slices,
        bytes memory metadata
    ) external returns (address pointer, File memory file);

    function createFile(
        string memory filename,
        address[] memory pointers
    ) external returns (address pointer, File memory file);

    function createFile(
        string memory filename,
        address[] memory pointers,
        bytes memory metadata
    ) external returns (address pointer, File memory file);

    function deleteFile(string memory filename) external;
}
