// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {IFileStore} from "../../src/IFileStore.sol";
import {RoseExample} from "../../src/examples/RoseExample.sol";

contract DeployRoseExample is Script {
    function run() public {
        vm.startBroadcast();

        new RoseExample(IFileStore(0x5E348d0975A920E9611F8140f84458998A53af94));

        vm.stopBroadcast();
    }
}
