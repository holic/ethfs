// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "openzeppelin/utils/Strings.sol";
import {ContentStore} from "../src/approach2/ContentStore.sol";
import {ContentStoreRegistry} from "../src/approach2/ContentStoreRegistry.sol";
import {FileStore} from "../src/approach2/FileStore.sol";
import {FileStoreRegistry} from "../src/approach2/FileStoreRegistry.sol";
import {FileReader} from "../src/approach2/FileReader.sol";
import {FileWriter} from "../src/approach2/FileWriter.sol";

contract MockProject {
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string.concat(
                "data:application/json,",
                "%7B%22name%22:%22Token #",
                Strings.toString(tokenId),
                "%22,%22animation_url%22:%22",
                string(FileStoreRegistry.getStore().readFileData("big.txt")),
                "%22%7D"
            );
    }
}

contract MockProjectApproach2Test is Test {
    MockProject private project;

    function setUp() public {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        console.log("chain id", chainId);

        bytes memory contentStoreCode = address(new ContentStore()).code;
        vm.etch(address(ContentStoreRegistry.getStore()), contentStoreCode);

        bytes memory fileStoreCode = address(new FileStore()).code;
        vm.etch(address(FileStoreRegistry.getStore()), fileStoreCode);

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = ContentStoreRegistry.getStore().addContent(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );
        checksums[1] = checksums[0];
        checksums[2] = checksums[0];
        checksums[3] = checksums[0];

        FileStoreRegistry.getStore().createFile(
            "big.txt",
            checksums,
            new bytes(0)
        );

        project = new MockProject();
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
    }
}
