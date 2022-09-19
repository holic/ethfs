// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "forge-std/Script.sol";
import {FileStore} from "../src/FileStore.sol";
import {FileDirectory} from "../src/FileDirectory.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        // TODO: check if we've already deployed and reuse if possible

        FileStore fileStore = new FileStore();
        FileDirectory directory = new FileDirectory(fileStore);

        vm.stopBroadcast();
    }
}
