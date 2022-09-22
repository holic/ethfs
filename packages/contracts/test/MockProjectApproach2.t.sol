// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.10 <0.9.0;

import "forge-std/Test.sol";
import "openzeppelin/utils/Strings.sol";
import {ContentStore} from "../src/approach2/ContentStore.sol";
import {ContentStoreRegistry} from "../src/approach2/ContentStoreRegistry.sol";
import {FileStore} from "../src/approach2/FileStore.sol";
import {FileStoreRegistry} from "../src/approach2/FileStoreRegistry.sol";
import {FileReader} from "../src/approach2/FileReader.sol";
import {FileWriter} from "../src/approach2/FileWriter.sol";
import {FileManager} from "../src/approach2/FileManager.sol";
import {IFileWrapper} from "../src/approach2/IFileWrapper.sol";
import {FileWrapper} from "../src/approach2/FileWrapper.sol";
import {FileWrapperChunk4} from "../src/approach2/FileWrapperChunk4.sol";
import {SSTORE2} from "sstore2/SSTORE2.sol";
import {Bytecode} from "sstore2/utils/Bytecode.sol";
import {DynamicBuffer} from "ethier/contracts/utils/DynamicBuffer.sol";

library Files {
    IFileWrapper public constant bigText =
        IFileWrapper(address(uint160(uint256(keccak256("big.txt")))));
}

contract MockProject {
    IFileWrapper public bigText;

    constructor(IFileWrapper _bigText) {
        bigText = _bigText;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        address[] memory pointers = bigText.allPointers();
        bytes memory uri = DynamicBuffer.allocate(bigText.size() + 10000);

        DynamicBuffer.appendSafe(uri, bytes("data:application/json,"));
        DynamicBuffer.appendSafe(uri, bytes("%7B%22name%22:%22Token #"));
        DynamicBuffer.appendSafe(uri, bytes(Strings.toString(tokenId)));
        DynamicBuffer.appendSafe(uri, bytes("%22,%22animation_url%22:%22"));
        for (uint256 i = 0; i < pointers.length; i++) {
            DynamicBuffer.appendSafe(uri, SSTORE2.read(pointers[i]));
        }
        DynamicBuffer.appendSafe(uri, bytes("%22%7D"));

        return string(uri);

        //  return
        //     string.concat(
        //         "data:application/json,",
        //         "%7B%22name%22:%22Token #",
        //         Strings.toString(tokenId),
        //         "%22,%22animation_url%22:%22",
        //         // string(FileManager.readFileData("big.txt")),
        //         string(bigText.read()),
        //         "%22%7D"
        //     );
    }
}

contract MockProjectApproach2Test is Test {
    MockProject private project;

    function setUp() public {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        console.log("chain id", chainId);

        bytes memory contentStoreCode = address(new ContentStore()).code;
        vm.etch(address(ContentStoreRegistry.getStore()), contentStoreCode);

        bytes memory fileStoreCode = address(new FileStore()).code;
        vm.etch(address(FileStoreRegistry.getStore()), fileStoreCode);

        bytes32[] memory checksums = new bytes32[](4);
        checksums[0] = ContentStoreRegistry.getStore().addContent(
            bytes(vm.readFile("packages/contracts/test/files/24kb-1.txt"))
        );
        checksums[1] = checksums[0];
        checksums[2] = checksums[0];
        checksums[3] = checksums[0];

        uint256 startGas;

        startGas = gasleft();
        FileStoreRegistry.getStore().createFile(
            "big.txt",
            checksums,
            new bytes(0)
        );
        console.log("FileStore.createFile gas", startGas - gasleft());

        startGas = gasleft();
        IFileWrapper deployedFile = IFileWrapper(new FileWrapper(checksums));
        console.log("new FileWrapper gas", startGas - gasleft());

        startGas = gasleft();
        IFileWrapper deployedFileInline = IFileWrapper(
            new FileWrapperChunk4(checksums)
        );
        console.log("new FileWrapperChunk4 gas", startGas - gasleft());

        project = new MockProject(deployedFileInline);

        // bytes memory bytecode = type(FileWrapper).creationCode;
        // bytes memory code = abi.encodePacked(bytecode, abi.encode(checksums));
        // address deployedFile;
        // assembly {
        //     deployedFile := create(0, add(code, 32), mload(code))
        // }
        // require(deployedFile != address(0), "file deploy failed");
        // FileWrapper deployedFile = new FileWrapper(checksums);
        // vm.etch(address(Files.bigText), address(deployedFile).code);

        uint256 size = 0;
        address[] memory pointers = new address[](checksums.length);
        ContentStore contentStore = ContentStoreRegistry.getStore();
        for (uint256 i = 0; i < checksums.length; i++) {
            size += contentStore.contentLength(checksums[i]);
            pointers[i] = contentStore.getPointer(checksums[i]);
        }

        startGas = gasleft();
        bytes memory data = DynamicBuffer.allocate(size);
        for (uint256 i = 0; i < pointers.length; i++) {
            DynamicBuffer.appendSafe(data, SSTORE2.read(pointers[i]));
        }
        console.log("reading directly", startGas - gasleft());
    }

    function testTokenURIGas() public {
        uint256 startGas = gasleft();
        project.tokenURI(1);
        console.log("tokenURI gas used:", startGas - gasleft());
        assertEq(98380, bytes(project.tokenURI(1)).length);
        // assertEq(98380, Files.bigText.size());
        // assertEq(98380, Files.bigText.read().length);
    }
}
