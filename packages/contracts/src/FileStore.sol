// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IFileStore} from "./IFileStore.sol";
import {Ownable2Step} from "openzeppelin/access/Ownable2Step.sol";
import {File, Content} from "./File.sol";
import {IContentStore} from "./IContentStore.sol";

contract FileStore is IFileStore, Ownable2Step {
    IContentStore public immutable contentStore;

    // filename => File checksum
    mapping(string => bytes32) public files;

    constructor(IContentStore _contentStore) {
        contentStore = _contentStore;
    }

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
            revert FileNotFound(filename);
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
            revert FileNotFound(filename);
        }
        address pointer = contentStore.pointers(checksum);
        if (pointer == address(0)) {
            revert FileNotFound(filename);
        }
        return abi.decode(SSTORE2.read(pointer), (File));
    }

    function createFile(string memory filename, bytes32[] memory checksums)
        public
        returns (File memory file)
    {
        return createFile(filename, checksums, new bytes(0));
    }

    function createFile(
        string memory filename,
        bytes32[] memory checksums,
        bytes memory extraData
    ) public returns (File memory file) {
        if (files[filename] != bytes32(0)) {
            revert FilenameExists(filename);
        }
        return _createFile(filename, checksums, extraData);
    }

    function _createFile(
        string memory filename,
        bytes32[] memory checksums,
        bytes memory extraData
    ) private returns (File memory file) {
        Content[] memory contents = new Content[](checksums.length);
        uint256 size = 0;
        // TODO: optimize this
        for (uint256 i = 0; i < checksums.length; ++i) {
            size += contentStore.contentLength(checksums[i]);
            contents[i] = Content({
                checksum: checksums[i],
                pointer: contentStore.getPointer(checksums[i])
            });
        }
        if (size == 0) {
            revert EmptyFile();
        }
        file = File({size: size, contents: contents});
        (bytes32 checksum, ) = contentStore.addContent(abi.encode(file));
        files[filename] = checksum;
        emit FileCreated(filename, checksum, filename, file.size, extraData);
    }

    function deleteFile(string memory filename) public onlyOwner {
        bytes32 checksum = files[filename];
        if (checksum == bytes32(0)) {
            revert FileNotFound(filename);
        }
        delete files[filename];
        emit FileDeleted(filename, checksum, filename);
    }
}
