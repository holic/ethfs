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
