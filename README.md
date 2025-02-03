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
2. Add `ethfs/` to `remappings.txt` or `foundry.toml`
3. `import "ethfs/contracts/src/FileStore.sol";` in your contract
4. Have fun!

## Reference

### Contract addresses

<table>
  <tbody>
    <tr>
      <th colspan="2">Ethereum</th>
    </tr>
    <tr>
      <td>Ethereum Mainnet</td>
      <td><a href="https://etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <td>Ethereum Sepolia</td>
      <td><a href="https://sepolia.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <td>Ethereum Holesky</td>
      <td><a href="https://holesky.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <th colspan="2">Base</th>
    </tr>
    <tr>
      <td>Base Mainnet</td>
      <td><a href="https://basescan.org/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <td>Base Sepolia</td>
      <td><a href="https://sepolia.basescan.org/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <th colspan="2">Optimism</th>
    </tr>
    <tr>
      <td>Optimism Mainnet</td>
      <td><a href="https://optimistic.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <td>Optimism Sepolia</td>
      <td><a href="https://sepolia-optimism.etherscan.io/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <th colspan="2">Shape</th>
    </tr>
    <tr>
      <td>Shape Mainnet</td>
      <td><a href="https://shapescan.xyz/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <td>Shape Sepolia</td>
      <td><a href="https://explorer-sepolia.shape.network/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <th colspan="2">Zora</th>
    </tr>
    <tr>
      <td>Zora Mainnet</td>
      <td><a href="https://explorer.zora.energy/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
    <tr>
      <td>Zora Sepolia</td>
      <td><a href="https://sepolia.explorer.zora.energy/address/0xFe1411d6864592549AdE050215482e4385dFa0FB">0xFe1411d6864592549AdE050215482e4385dFa0FB</a></td>
    </tr>
  </tbody>
</table>
