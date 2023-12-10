// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {FileStore} from "../src/FileStore.sol";
import {FileStoreFrontend} from "../src/FileStoreFrontend.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        // TODO: set up deployer instead of using CREATE2_FACTORY
        ContentStore contentStore = new ContentStore(
            0x4e59b44847b379578588920cA78FbF26c0B4956C
        );
        new FileStore(contentStore);
        new FileStoreFrontend();

        vm.stopBroadcast();
    }
}
