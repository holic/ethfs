// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "forge-std/Script.sol";
import {FileStore} from "../src/FileStore.sol";

contract DeployFileStore is Script {
    FileStore public fileStore;

    function run() public {
        vm.startBroadcast();

        // TODO: write deploy address to file
        fileStore = new FileStore();

        bytes memory data = bytes(
            vm.readFile("packages/contracts/test/files/24kb-1.txt")
        );
        bytes32 checksum = keccak256(data);
        fileStore.writeChunk(data);
        bytes memory storedChunk = fileStore.readChunk(checksum);

        console.log("checksum", uint256(checksum));
        console.log("data length", data.length);
        console.log("chunk size", fileStore.chunkSize(checksum));
        console.log("storedChunk length", storedChunk.length);

        vm.stopBroadcast();
    }
}
