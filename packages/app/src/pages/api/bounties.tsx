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

const files = {
  p5js: path.join(process.cwd(), "bounties/p5-v1.5.0.min.js"),
};

const prepareFiles = () => {
  Object.entries(files).forEach(([, file]) => {
    const originalContents = fs.readFileSync(file);
    const compressed = zlib.gzipSync(originalContents);
    fs.writeFileSync(`${file}.gz`, compressed);
    const encoded = fs.readFileSync(`${files.p5js}.gz`).toString("base64");
    const contents: string[] = [];
    for (let i = 0; i < encoded.length; i += maxContentSize) {
      contents.push(encoded.slice(i, i + maxContentSize));
    }
    fs.writeFileSync(
      `${file}.json`,
      JSON.stringify(
        {
          name: `${path.basename(files.p5js)}.gz`,
          size: encoded.length,
          contents,
          checksums: contents.map((content) =>
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content))
          ),
          metadata: {
            type: "text/javascript",
            encoding: "base64",
            compression: "gzip",
            license: fs.readFileSync(`${files.p5js}.license`).toString(),
          },
        },
        null,
        2
      )
    );
  });
};

// prepareFiles();

const handler = (req: NextApiRequest, res: NextApiResponse<BountyFile[]>) => {
  res.json([JSON.parse(fs.readFileSync(`${files.p5js}.json`).toString())]);
};

export default handler;
