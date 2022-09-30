// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {LibString} from "solady/utils/LibString.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {File} from "../src/File.sol";
import {FileStore} from "../src/FileStore.sol";
import {IFileStore} from "../src/IFileStore.sol";

contract MockProject {
    IFileStore public immutable fileStore;

    constructor(IFileStore _fileStore) {
        fileStore = _fileStore;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        File memory file = fileStore.getFile("big.txt");
        return
            string.concat(
                "data:application/json,",
                "%7B%22name%22:%22Token #",
                LibString.toString(tokenId),
                "%22,%22animation_url%22:%22",
                file.read(),
                "%22%7D"
            );
    }
}

contract MockProjectTest is Test {
    IContentStore public contentStore;
    IFileStore public fileStore;
    MockProject public project;

    function setUp() public {
        contentStore = new ContentStore();
        fileStore = new FileStore(contentStore);

        (bytes32 checksum, ) = fileStore.contentStore().addContent(
            bytes(vm.readFile("packages/contracts/test/files/sstore2-max.txt"))
        );

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = checksum;
        checksums[1] = checksum;
        checksums[2] = checksum;
        checksums[3] = checksum;

        fileStore.createFile("big.txt", checksums);

        project = new MockProject(fileStore);
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(bytes(project.tokenURI(1)).length, 98380);
    }
}
