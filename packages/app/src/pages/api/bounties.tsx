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
    license?: string;
  };
};

const files = {
  p5js: path.join(process.cwd(), "bounties/p5-v1.5.0.min.js"),
};

const prepareFiles = () => {
  Object.entries(files).forEach(([, file]) => {
    const contents = fs.readFileSync(file);
    fs.writeFileSync(`${file}.gz`, zlib.gzipSync(contents));
  });
};

const handler = (req: NextApiRequest, res: NextApiResponse<BountyFile[]>) => {
  const encoded = fs.readFileSync(`${files.p5js}.gz`).toString("base64");
  const contents: string[] = [];
  for (let i = 0; i < encoded.length; i += maxContentSize) {
    contents.push(encoded.slice(i, i + maxContentSize));
  }
  res.json([
    {
      name: path.basename(files.p5js),
      size: encoded.length,
      contents,
      checksums: contents.map((content) =>
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content))
      ),
      metadata: {
        type: "application/javascript",
        encoding: "base64",
        compression: "gzip",
        license: fs.readFileSync(`${files.p5js}.license`).toString(),
      },
    },
  ]);
};

export default handler;
