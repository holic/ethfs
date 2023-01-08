import { ethers } from "ethers";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import zlib from "node:zlib";
import path from "path";

// https://eips.ethereum.org/EIPS/eip-170
// 0x6000 minus 1 byte for SSTORE2 prefix
export const maxContentSize = parseInt("6000", 16) - 1;

export type BountyFile = {
  name: string;
  contents: string[];
  checksums: string[];
  size: number;
  metadata: {
    type: string;
    encoding: "base64";
    compression?: "gzip";
    license: string;
  };
};

export type BountiesResponse = Record<string, BountyFile>;

const files = {
  "p5.js v1.5.0": path.join(process.cwd(), "bounties/p5-v1.5.0.min.js"),
};

const prepareFiles = () => {
  Object.entries(files).forEach(([, file]) => {
    const originalContents = fs.readFileSync(file);
    const compressed = zlib.gzipSync(originalContents);
    fs.writeFileSync(`${file}.gz`, compressed);
    const encoded = fs.readFileSync(`${file}.gz`).toString("base64");
    const contents: string[] = [];
    for (let i = 0; i < encoded.length; i += maxContentSize) {
      contents.push(encoded.slice(i, i + maxContentSize));
    }
    fs.writeFileSync(
      `${file}.json`,
      JSON.stringify(
        {
          name: `${path.basename(file)}.gz`,
          size: encoded.length,
          contents,
          checksums: contents.map((content) =>
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content))
          ),
          metadata: {
            type: "application/javascript",
            encoding: "base64",
            compression: "gzip",
            license: fs.readFileSync(`${file}.license`).toString(),
          },
        },
        null,
        2
      )
    );
  });
};

// prepareFiles();

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<BountiesResponse>
) => {
  res.json(
    Object.fromEntries(
      Object.entries(files).map(([name, file]) => [
        name,
        JSON.parse(fs.readFileSync(`${file}.json`).toString()),
      ])
    )
  );
};

export default handler;
