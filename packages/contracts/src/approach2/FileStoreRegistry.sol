// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {FileStore} from "./FileStore.sol";
import {FileReader} from "./FileReader.sol";

// TODO: make IFileStore an interface to avoid importing all deps

library FileStoreRegistry {
    error ChainNotSupported();

    function getStore() public view returns (FileStore) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        if (chainId == 1) {
            // TODO
            return FileStore(0x0000000000000000000000000000000000000000);
        }

        return FileStore(address(uint160(uint256(keccak256("FileStore")))));
        // revert("ChainNotSupported");
    }
}
