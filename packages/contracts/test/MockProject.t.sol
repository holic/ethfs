// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {LibString} from "solady/utils/LibString.sol";
import {ContentStore} from "../src/ContentStore.sol";
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
    ContentStore private contentStore;
    FileStore private fileStore;
    MockProject private project;
    bytes32 private bigFileChecksum;

    function setUp() public {
        contentStore = new ContentStore();
        fileStore = new FileStore(contentStore);

        (bigFileChecksum, ) = contentStore.addContent(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = bigFileChecksum;
        checksums[1] = bigFileChecksum;
        checksums[2] = bigFileChecksum;
        checksums[3] = bigFileChecksum;

        uint256 startGas;

        startGas = gasleft();
        fileStore.createFile("big.txt", checksums);
        console.log("FileStore.createFile gas", startGas - gasleft());

        project = new MockProject(fileStore);
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(98380, bytes(project.tokenURI(1)).length);
    }

    function testContentLength() public {
        uint256 startGas = gasleft();
        contentStore.contentLength(bigFileChecksum);
        console.log("contentLength gas used:", startGas - gasleft());
        assertEq(24575, contentStore.contentLength(bigFileChecksum));
    }
}
