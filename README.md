# EthFS: Ethereum File System

_Browse and upload on-chain files at [ethfs.xyz](https://ethfs.xyz)_

## What?

[dhof's on-chain 3D rose NFT](https://twitter.com/dhof/status/1569750046106873857) inspired tons of fun conversations and projects. It surfaced many examples and use cases for highly reusable on-chain assets (JS libraries, fonts, gifs).

EthFS is an effort to consolidate these assets into a public, durable on-chain repository with ergonomic, gas-optimized methods for reading and writing files.

## How does it work?

EthFS leans on [SSTORE2](https://github.com/0xsequence/sstore2)'s strategy to efficiently read and write data in the form of contract bytecode. The frontend splits files into 24kb chunks (max contract size) and writes them to the `ContentStore`, a content-addressable data storage contract.

A `File` struct wraps a set of content checksums that, when concatenated in order, represent the full file contents. It also holds the logic for reading/unwrapping the file contents into a single string in a very gas-efficient way.

The `FileStore` contract acts as a minimum viable registry, a global namespace of human-readable filenames for more ergonomic use within consumer contracts and the frontend's file browser.

> For specific use cases (e.g. different naming schemes, permissioning, etc.), you may decide to create your own file store abstraction. That's great! The `ContentStore` is designed to be unopinionated (strictly content-addressable), so that building on top of it can benefit everyone.

## Reference

### Ethereum Mainnet contracts

|                   |                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| ContentStore      | [0xC6806fd75745bB5F5B32ADa19963898155f9DB91](https://etherscan.io/address/0xC6806fd75745bB5F5B32ADa19963898155f9DB91) |
| FileStore         | [0x9746fD0A77829E12F8A9DBe70D7a322412325B91](https://etherscan.io/address/0x9746fD0A77829E12F8A9DBe70D7a322412325B91) |
| FileStoreFrontend | [0xBc66C61BCF49Cc3fe4E321aeCEa307F61EC57C0b](https://etherscan.io/address/0xBc66C61BCF49Cc3fe4E321aeCEa307F61EC57C0b) |

### Ethereum Goerli contracts

|                   |                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ContentStore      | [0x7c1730B7bE9424D0b983B84aEb254e3a2a105d91](https://goerli.etherscan.io/address/0x7c1730B7bE9424D0b983B84aEb254e3a2a105d91) |
| FileStore         | [0x5E348d0975A920E9611F8140f84458998A53af94](https://goerli.etherscan.io/address/0x5E348d0975A920E9611F8140f84458998A53af94) |
| FileStoreFrontend | [0xC8f76cb751B9e983bcF1Cf4824dD1A9441c6F190](https://goerli.etherscan.io/address/0xC8f76cb751B9e983bcF1Cf4824dD1A9441c6F190) |
