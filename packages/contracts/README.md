# On-chain, content addressable file store

Dom's on-chain 3D rose NFT inspired tons of fun conversations and projects. It surfaced many examples and use cases for highly reusable on-chain assets (JS libs, fonts, gifs). The smart contracts in this project are an effort to consolidate these into a single on-chain repository.

It's split into two parts: a generic, content-addressable bytes store (`ContentStore`) and a minimum-viable, named file store (`FileStore`).

### ContentStore

The `ContentStore` is designed in such a way that it can underpin many file store abstractions. Because bytes are indexed in a content addressable way (a checksum derived using `keccak256(bytes)`), I am hopeful that commonly used assets only need to be written to the chain once. For bytes already stored on-chain with `SSTORE2`, it offers a way to backfill checksums (`addPointer(address)`) to avoid writing this data again.

### FileStore

The `FileStore` is a little more opinionated and has some trade-offs. Files created need to be named and the namespace is global, so we'll need to coordinate off-chain to come up with a good naming system. A frontend for file uploads and file browsing will be released alongside these contracts to make this a little easier. It also has a way for the contract owner to delete files, in case malicious files are discovered.

This file store is not meant to solve every use case and you're encouraged to create your own file store abstractions on top of the `ContentStore`. For example, you may want to enforce more structured, on-chain metadata or allow for only certain types of metadata. Or maybe your content isn't necessarily a "file" but some other artifact that can still take advantage of the content-addressable store.

## Usage

First, populate the content-addressable store with data. For large files, you can split data into multiple chunks (up to 24kb each).

> Note: For the purposes of a `tokenURI`, It's recommended to base64-encode files before splitting them up and storing them to reduce the read gas overhead.

```solidity
bytes memory content = ...
IFileStore memory fileStore = IFileStore(...);

(bytes32 checksum,) = fileStore.contentStore().addContent(content);
```

With a reference to all the checksums that make up the file, create a file in the file store.

```solidity
bytes32[] memory checksums = new bytes32(1);
checksums[0] = checksum;

fileStore.createFile("funny.gif", checksums);
```

To use a file from the file store, retrieve the File object and then read it inline.

```solidity
string memory gif = fileStore.getFile("funny.gif").read();
```

## Emitting file metadata for indexers

The file store is not prescriptive about file metadata, but includes a way to emit extra data associated with the file creation event that can be used in off-chain indexers like subgraphs. This isn't stored on chain for gas purposes and a simpler, less opinionated API.

This repo includes a frontend and subgraph that will make use of this extra data field to specify file content type, encoding, etc.

```solidity
struct FileMetadata {
    string contentType;
    string contentEncoding;
}

fileStore.createFile(
    "funny.gif",
    checksums,
    abi.encode(FileMetadata({
        contentType: "image/gif",
        contentEncoding: "base64"
    }))
);
```
