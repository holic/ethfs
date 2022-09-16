// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {File, FileStore} from "./FileStore.sol";
import {Ownable2Step} from "openzeppelin/access/Ownable2Step.sol";

interface IDirectory {
    event FileCreated(
        string indexed filename,
        bytes32 indexed checksum,
        uint256 size,
        string contentType,
        string contentEncoding
    );
    event FileDeleted(string indexed filename);
}

contract Directory is IDirectory, Ownable2Step {
    FileStore public immutable fileStore;

    // filename => File checksum
    mapping(string => bytes32) public files;
    string[] public filenames;

    error FileNotFound();
    error FilenameExists();

    constructor(FileStore _fileStore) {
        fileStore = _fileStore;
    }

    function fileExists(string memory filename) public view returns (bool) {
        return files[filename] != bytes32(0);
    }

    function readFile(string memory filename)
        public
        view
        returns (File memory file)
    {
        bytes32 checksum = files[filename];
        if (checksum == bytes32(0)) {
            revert FileNotFound();
        }
        return fileStore.readFile(checksum);
    }

    function readFileData(string memory filename)
        public
        view
        returns (bytes memory data)
    {
        File memory file = readFile(filename);
        return fileStore.readFileData(file);
    }

    function createFile(string memory filename, File memory file) public {
        if (files[filename] != bytes32(0)) {
            revert FilenameExists();
        }
        bytes32 checksum = fileStore.writeFile(file);
        files[filename] = checksum;
        filenames.push(filename);
        emit FileCreated(
            filename,
            checksum,
            file.size,
            file.contentType,
            file.contentEncoding
        );
    }

    function deleteFile(string memory filename) public onlyOwner {
        delete files[filename];
        emit FileDeleted(filename);
    }
}
