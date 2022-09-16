// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {File, FileStore} from "./FileStore.sol";

contract Directory {
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

    function writeFile(string memory filename, File memory file) public {
        if (files[filename] != bytes32(0)) {
            revert FilenameExists();
        }
        bytes32 checksum = fileStore.writeFile(file);
        files[filename] = checksum;
        filenames.push(filename);
    }
}
