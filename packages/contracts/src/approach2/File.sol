// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

// TODO: indicate when a file is already base64 encoded, html escaped, json escaped?

struct File {
    // TODO: store size in a smaller format?
    uint256 size; // content length in bytes, max 24k
    string contentType; // e.g. image/png, text/javascript, datauri
    string contentEncoding; // optional, e.g. gzip
    bytes32[] checksums;
}
