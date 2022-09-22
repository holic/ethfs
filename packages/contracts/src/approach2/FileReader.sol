// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";
import {ContentStore, ContentStoreRegistry} from "./ContentStoreRegistry.sol";
import {File} from "./File.sol";

library FileReader {
    error FileNotFound(bytes32 checksum);

    function readFile(bytes32 checksum) public view returns (File memory file) {
        address pointer = ContentStoreRegistry.getStore().getPointer(checksum);
        if (pointer == address(0)) {
            revert FileNotFound(checksum);
        }
        return abi.decode(SSTORE2.read(pointer), (File));
    }

    function readFileData(bytes32 checksum)
        public
        view
        returns (bytes memory data)
    {
        File memory file = readFile(checksum);
        return readFileData(file);
    }

    function readFileData(File memory file)
        public
        view
        returns (bytes memory data)
    {
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
