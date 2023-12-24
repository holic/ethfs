// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.22;

import {LibString} from "solady/utils/LibString.sol";
import {ERC721} from "openzeppelin/token/ERC721/ERC721.sol";
import {IFileStore} from "../IFileStore.sol";

// A demonstration of dhof's 3D rose token using FileStore as a backend for the heavy, reusable assets
// https://opensea.io/assets/ethereum/0x3e743377417cd7ca70dcc9bf08fac55664ed3181/1

contract RoseExample is ERC721 {
    IFileStore public immutable fileStore;

    constructor(IFileStore _fileStore) ERC721("RoseExample", "ROSE") {
        fileStore = _fileStore;
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
        _mint(msg.sender, 3);
        _mint(msg.sender, 4);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return
            string.concat(
                "data:application/json,%7B%22name%22%3A%22Example%20Rose%22%2C%22animation_url%22%3A%22data%3Atext%2Fhtml%2C%253Cscript%250A%2520%2520type%253D%2522text%252Fjavascript%252Bgzip%2522%250A%2520%2520src%253D%2522data%253Atext%252Fjavascript%253Bbase64%252C",
                fileStore.getFile("three.min.js.gz").read(),
                "%2522%250A%253E%253C%252Fscript%253E%250A%253Cscript%2520src%253D%2522data%253Atext%252Fjavascript%253Bbase64%252C",
                fileStore.getFile("gunzipScripts.js").read(),
                "%2522%253E%253C%252Fscript%253E%250A%250A%253Cscript%253E%250A%2520%2520var%2520tokenId%2520%253D%2520",
                LibString.toString(tokenId),
                "%253B%250A%253C%252Fscript%253E%250A%253Cstyle%253E%250A%2520%2520*%2520%257B%250A%2520%2520%2520%2520margin%253A%25200%253B%250A%2520%2520%2520%2520padding%253A%25200%253B%250A%2520%2520%257D%250A%2520%2520canvas%2520%257B%250A%2520%2520%2520%2520width%253A%2520100%2525%253B%250A%2520%2520%2520%2520height%253A%2520100%2525%253B%250A%2520%2520%257D%250A%253C%252Fstyle%253E%250A%253Cscript%2520src%253D%2522data%253Atext%252Fjavascript%253Bbase64%252C",
                fileStore.getFile("rose.js").read(),
                "%2522%253E%253C%252Fscript%253E%250A%22%7D"
            );
    }
}
