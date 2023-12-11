// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

import {BytecodeSlice} from "./BytecodeSlice.sol";

interface IContentStore {
    event NewContent(address indexed pointer, uint32 size);

    error ContentAlreadyExists(address pointer);
    error ContentNotFound(address pointer);
    error UnexpectedPointer(address expectedPointer, address actualPointer);

    function pointerExists(address pointer) external view returns (bool);

    function contentLength(address pointer) external view returns (uint32 size);

    function getPointer(bytes memory content) external view returns (address);

    function addContent(
        bytes memory content
    ) external returns (address pointer);

    function getContent(
        address pointer
    ) external returns (bytes memory content);
}
