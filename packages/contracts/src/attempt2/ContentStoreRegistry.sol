// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {ContentStore} from "./ContentStore.sol";

library ContentStoreRegistry {
    error ChainNotSupported();

    function getStore() public view returns (ContentStore) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        if (chainId == 1) {
            // TODO
            return ContentStore(0x0000000000000000000000000000000000000000);
        }

        return
            ContentStore(address(uint160(uint256(keccak256("ContentStore")))));
        // revert("ChainNotSupported");
    }
}
