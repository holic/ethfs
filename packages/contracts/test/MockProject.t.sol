// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "openzeppelin/utils/Strings.sol";
import {IFileDirectory, FileDirectory} from "../src/FileDirectory.sol";

contract MockProject {
    FileDirectory private directory;

    constructor(FileDirectory _directory) public {
        directory = _directory;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string.concat(
                "data:application/json,",
                "%7B%22name%22:%22Token #",
                Strings.toString(tokenId),
                "%22,%22animation_url%22:%22",
                string(directory.readNamedFileData("big.txt")),
                "%22%7D"
            );
    }
}

contract FileDirectoryTest is Test {
    MockProject private project;

    function setUp() public {
        FileDirectory directory = new FileDirectory();

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = directory.writeChunk(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );
        checksums[1] = checksums[0];
        checksums[2] = checksums[0];
        checksums[3] = checksums[0];

        directory.createFile("big.txt", "text/plain", "", checksums);

        project = new MockProject(directory);
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
    }
}
