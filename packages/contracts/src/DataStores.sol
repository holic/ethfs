// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {IContentStore} from "./IContentStore.sol";
import {IFileStore} from "./IFileStore.sol";

library DataStores {
    error ChainNotSupported();

    function fileStore() public view returns (IFileStore) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        // Mainnet
        if (chainId == 1) {
            // TODO
            return IFileStore(0x0000000000000000000000000000000000000000);
        }

        // Foundry/Anvil
        if (chainId == 31337) {
            return
                IFileStore(address(uint160(uint256(keccak256("FileStore")))));
        }

        revert ChainNotSupported();
    }

    function contentStore() public view returns (IContentStore) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        // Mainnet
        if (chainId == 1) {
            // TODO
            return IContentStore(0x0000000000000000000000000000000000000000);
        }

        // Foundry/Anvil
        if (chainId == 31337) {
            return
                IContentStore(
                    address(uint160(uint256(keccak256("ContentStore"))))
                );
        }

        revert ChainNotSupported();
    }
}
