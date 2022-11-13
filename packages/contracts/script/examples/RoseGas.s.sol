// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {IERC721Metadata} from "openzeppelin/token/ERC721/extensions/IERC721Metadata.sol";

contract RoseGas is Script {
    function run() public {
        vm.startBroadcast();

        uint256 startGas = gasleft();
        IERC721Metadata(0x55500dCABbE3C30273B6381c70C73DedC8D61C54).tokenURI(1);
        console.log("gas used", startGas - gasleft());

        vm.stopBroadcast();
    }
}
