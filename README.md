# EthFS: Ethereum File System

_Browse and upload on-chain files at [ethfs.xyz](https://ethfs.xyz)_

## What?

[dhof's on-chain 3D rose NFT](https://twitter.com/dhof/status/1569750046106873857) inspired tons of fun conversations and projects. It surfaced many examples and use cases for highly reusable on-chain assets (JS libraries, fonts, gifs).

EthFS is an effort to consolidate these assets into a public, durable on-chain repository with ergonomic, gas-optimized methods for reading and writing files.

## How does it work?

EthFS leans on [SSTORE2](https://github.com/0xsequence/sstore2)'s strategy to efficiently read and write data in the form of contract bytecode. The frontend splits files into 24kb chunks (max contract size) and writes them to deterministic content addresses via [Safe Singleton Factory](https://github.com/safe-global/safe-singleton-factory). This means the content address can be computed ahead of time and is the same across EVM chains.

A `File` struct wraps a set of bytecode slices that, when concatenated, represent the full file contents. It also holds the logic for reading/unwrapping the file contents into a single string in a very gas-efficient way.

The `FileStore` contract acts as a minimum viable registry, a global namespace of human-readable filenames for more ergonomic use within consumer contracts and the frontend's file browser. A CDN of sorts.

## Installation (Foundry)

1. `forge install holic/ethfs`

2. Go into your `foundry.toml` and add `"@holic/ethfs/"` to your `remappings` array

3. Go into your `.sol` file and add `import "@holic/ethfs/contracts/src/FileStore.sol";`

4. Have fun!

## Reference

### Contract addresses

|                  |                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Ethereum**     |                                                                                                                                        |
| Ethereum Mainnet | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)                  |
| Ethereum Goerli  | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://goerli.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)           |
| Ethereum Sepolia | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://sepolia.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)          |
| Ethereum Holesky | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://holesky.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)          |
| **Base**         |                                                                                                                                        |
| Base Mainnet     | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://basescan.org/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)                  |
| Base Goerli      | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://goerli.basescan.org/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)           |
| Base Sepolia     | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://sepolia.basescan.org/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)          |
| **Optimism**     |                                                                                                                                        |
| Optimism Mainnet | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://optimistic.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)       |
| Optimism Goerli  | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://goerli-optimism.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB)  |
| Optimism Sepolia | [0xFe1411d6864592549AdE050215482e4385dFa0FB](https://sepolia-optimism.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB) |
