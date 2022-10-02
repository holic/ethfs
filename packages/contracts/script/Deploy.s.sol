// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {ContentStore} from "../src/ContentStore.sol";
import {FileStore} from "../src/FileStore.sol";
import {FileStoreFrontend} from "../src/FileStoreFrontend.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        ContentStore contentStore = new ContentStore();
        new FileStore(contentStore);
        new FileStoreFrontend();

        vm.stopBroadcast();
    }
}
