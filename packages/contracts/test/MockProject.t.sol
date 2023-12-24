// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import {GasReporter} from "@latticexyz/gas-report/GasReporter.sol";
import {LibString} from "solady/utils/LibString.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {File, BytecodeSlice} from "../src/File.sol";
import {FileStore} from "../src/FileStore.sol";
import {IFileStore} from "../src/IFileStore.sol";
import {SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE} from "../test/safeSingletonFactory.sol";

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

contract MockProjectTest is Test, GasReporter {
    IContentStore public contentStore;
    IFileStore public fileStore;
    MockProject public project;

    function setUp() public {
        vm.etch(SAFE_SINGLETON_FACTORY, SAFE_SINGLETON_FACTORY_BYTECODE);
        contentStore = new ContentStore(SAFE_SINGLETON_FACTORY);
        fileStore = new FileStore(contentStore);

        string memory content = vm.readFile("test/files/sstore2-max.txt");
        fileStore.createFile(
            "big.txt",
            string.concat(content, content, content, content)
        );

        project = new MockProject(fileStore);
    }

    function testTokenURI() public {
        startGasReport("token URI");
        project.tokenURI(1);
        endGasReport();
        assertEq(bytes(project.tokenURI(1)).length, 98380);
    }
}
