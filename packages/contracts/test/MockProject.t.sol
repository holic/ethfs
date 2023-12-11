// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {LibString} from "solady/utils/LibString.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {IContentStore} from "../src/IContentStore.sol";
import {BytecodeSlice} from "../src/BytecodeSlice.sol";
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

        BytecodeSlice[] memory slices = new BytecodeSlice[](4);
        slices[0] = BytecodeSlice({pointer: pointer, size: 0, offset: 1});
        slices[1] = BytecodeSlice({pointer: pointer, size: 0, offset: 1});
        slices[2] = BytecodeSlice({pointer: pointer, size: 0, offset: 1});
        slices[3] = BytecodeSlice({pointer: pointer, size: 0, offset: 1});

        fileStore.createFile("big.txt", slices);

        project = new MockProject(fileStore);
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(bytes(project.tokenURI(1)).length, 98380);
    }
}
