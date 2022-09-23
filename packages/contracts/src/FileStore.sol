// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {IFileStore} from "./IFileStore.sol";
import {Ownable2Step} from "openzeppelin/access/Ownable2Step.sol";
import {File} from "./File.sol";
import {FileWriter} from "./FileWriter.sol";
import {FileReader} from "./FileReader.sol";

contract FileStore is IFileStore, Ownable2Step {
    // filename => File checksum
    mapping(string => bytes32) public files;
    string[] public filenames;

    function fileExists(string memory filename) public view returns (bool) {
        return files[filename] != bytes32(0);
    }

    function getChecksum(string memory filename)
        public
        view
        returns (bytes32 checksum)
    {
        checksum = files[filename];
        if (checksum == bytes32(0)) {
            revert FileNotFound();
        }
        return checksum;
    }

    function getFile(string memory filename)
        public
        view
        returns (File memory file)
    {
        bytes32 checksum = files[filename];
        if (checksum == bytes32(0)) {
            revert FileNotFound();
        }
        return FileReader.getFile(checksum);
    }

    function createFile(
        string memory filename,
        bytes32[] memory checksums,
        bytes memory metadata
    ) public {
        if (files[filename] != bytes32(0)) {
            revert FilenameExists();
        }
        return _createFile(filename, checksums, metadata);
    }

    function _createFile(
        string memory filename,
        bytes32[] memory checksums,
        bytes memory metadata
    ) private {
        (bytes32 checksum, File memory file) = FileWriter.writeFile(
            checksums,
            metadata
        );
        files[filename] = checksum;
        filenames.push(filename);
        emit FileCreated(filename, checksum, file.size, metadata);
    }

    function deleteFile(string memory filename) public onlyOwner {
        delete files[filename];
        emit FileDeleted(filename);
    }
}
