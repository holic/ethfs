// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {SSTORE2} from "solady/utils/SSTORE2.sol";
import {IFileStore} from "./IFileStore.sol";
import {IContentStore} from "./IContentStore.sol";

// Convenience methods to call from the frontend or subgraph, where they would
// otherwise be too gas heavy for another contract.

contract FileStoreFrontend {
    function readFile(IFileStore fileStore, string memory filename)
        public
        view
        returns (string memory contents)
    {
        return fileStore.getFile(filename).read();
    }

    function getContent(IContentStore contentStore, bytes32 checksum)
        public
        view
        returns (bytes memory content)
    {
        return SSTORE2.read(contentStore.getPointer(checksum));
    }
}
