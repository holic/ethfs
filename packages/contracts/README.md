# TODO

- try SSTORE2Map for gas, but may not let us prepopulate the map
- check read gas if we store Files with (checksum, pointer)[] instead of checksum[] to avoid read time store look ups
- use interfaces to reduce downstream imports
- try deploying file reader/wrapper as a contract with all the info inside it that is needed to read out files

- ~~decide if getters (contentLength, getPointer) should revert or return 0~~
  revert, since mapping getters are already available
- ~~check read gas on rebuilding files within library instead of store contract~~
  it is cheaper (store contract sends checksums/pointers instead of bytes)
