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
        // TODO: set up deployer instead of using CREATE2_FACTORY
        contentStore = new ContentStore(
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );
        fileStore = new FileStore(contentStore);

        address pointer = fileStore.contentStore().addContent(
            bytes(vm.readFile("test/files/sstore2-max.txt"))
        );

        address[] memory pointers = new address[](4);
        pointers[0] = pointer;
        pointers[1] = pointer;
        pointers[2] = pointer;
        pointers[3] = pointer;

        fileStore.createFile("big.txt", pointers);

        project = new MockProject(fileStore);
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(bytes(project.tokenURI(1)).length, 98380);
    }
}
