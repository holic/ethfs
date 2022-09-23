// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import {LibString} from "solady/utils/LibString.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {FileStore} from "../src/FileStore.sol";
import {FileReader} from "../src/FileReader.sol";
import {FileWriter} from "../src/FileWriter.sol";
import {DataStores} from "../src/DataStores.sol";

contract MockProject {
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string.concat(
                "data:application/json,",
                "%7B%22name%22:%22Token #",
                LibString.toString(tokenId),
                "%22,%22animation_url%22:%22",
                string(FileReader.readFile("big.txt")),
                "%22%7D"
            );
    }
}

contract MockProjectTest is Test {
    MockProject private project;
    bytes32 private bigFileChecksum;

    function setUp() public {
        bytes memory contentStoreCode = address(new ContentStore()).code;
        vm.etch(address(DataStores.contentStore()), contentStoreCode);

        bytes memory fileStoreCode = address(new FileStore()).code;
        vm.etch(address(DataStores.fileStore()), fileStoreCode);

        (bigFileChecksum, ) = DataStores.contentStore().addContent(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = bigFileChecksum;
        checksums[1] = bigFileChecksum;
        checksums[2] = bigFileChecksum;
        checksums[3] = bigFileChecksum;

        uint256 startGas;

        startGas = gasleft();
        DataStores.fileStore().createFile("big.txt", checksums, new bytes(0));
        console.log("FileStore.createFile gas", startGas - gasleft());

        project = new MockProject();
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(98380, bytes(project.tokenURI(1)).length);
    }

    function testContentLength() public {
        uint256 startGas = gasleft();
        DataStores.contentStore().contentLength(bigFileChecksum);
        console.log("contentLength gas used:", startGas - gasleft());
        assertEq(
            24575,
            DataStores.contentStore().contentLength(bigFileChecksum)
        );
    }
}
