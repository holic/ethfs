// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "openzeppelin/utils/Strings.sol";
import {FileDirectory} from "../src/approach1/FileDirectory.sol";
import {FileStore} from "../src/approach1/FileStore.sol";

contract MockProject {
    FileDirectory public immutable fileDirectory;

    constructor(FileDirectory _fileDirectory) {
        fileDirectory = _fileDirectory;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string.concat(
                "data:application/json,",
                "%7B%22name%22:%22Token #",
                Strings.toString(tokenId),
                "%22,%22animation_url%22:%22",
                string(fileDirectory.readNamedFileData("big.txt")),
                "%22%7D"
            );
    }
}

contract MockProjectApproach1Test is Test {
    MockProject private project;

    function setUp() public {
        FileStore fileStore = new FileStore();
        FileDirectory fileDirectory = new FileDirectory(fileStore);

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = fileDirectory.fileStore().writeChunk(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );
        checksums[1] = checksums[0];
        checksums[2] = checksums[0];
        checksums[3] = checksums[0];

        fileDirectory.createFile("big.txt", "text/plain", "", checksums);

        project = new MockProject(fileDirectory);
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(98380, bytes(project.tokenURI(1)).length);
    }
}
