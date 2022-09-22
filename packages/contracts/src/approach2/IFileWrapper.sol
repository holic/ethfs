// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

interface IFileWrapper {
    function size() external view returns (uint256);

    function read() external view returns (bytes memory);

    function allPointers() external view returns (address[] memory);
}
