// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {ContentStore} from "./ContentStore.sol";
import {FileStore} from "./FileStore.sol";
import {FileReader} from "./FileReader.sol";
import {FileWriter} from "./FileWriter.sol";
import {File} from "./File.sol";
import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {ContentStoreRegistry} from "./ContentStoreRegistry.sol";
import {FileStoreRegistry} from "./FileStoreRegistry.sol";

library FileManager {
    error ChainNotSupported();

    function fileStore() public view returns (FileStore) {
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

    function contentStore() public view returns (ContentStore) {
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

    function readFileData(string memory filename)
        public
        view
        returns (bytes memory data)
    {
        address pointer = contentStore().getPointer(
            fileStore().getChecksum(filename)
        );
        File memory file = abi.decode(SSTORE2.read(pointer), (File));
        data = DynamicBuffer.allocate(file.size);
        for (uint256 i = 0; i < file.contents.length; i++) {
            DynamicBuffer.appendSafe(
                data,
                SSTORE2.read(file.contents[i].pointer)
            );
        }
        return data;
    }
}
