// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.21;

interface IContentStore {
    event NewContent(address indexed pointer, uint32 contentSize);

    error ContentTooLarge(uint32 contentSize, uint32 maxSize);
    error ContentAlreadyExists(address pointer);
    error ContentNotFound(address pointer);
    error AddContentFailed();
    error UnexpectedPointer(address expectedPointer, address actualPointer);

    function pointerExists(address pointer) external view returns (bool);

    function contentLength(address pointer) external view returns (uint32 size);

    function pointerForContent(
        bytes memory content
    ) external view returns (address);

    function addContent(
        bytes memory content
    ) external returns (address pointer);

    function getContent(
        address pointer
    ) external returns (bytes memory content);
}
