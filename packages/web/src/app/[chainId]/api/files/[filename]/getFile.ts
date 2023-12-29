"use server";

import { OnchainFile } from "../../../../../common";
import { sql } from "../../../../../database";
import { supportedChains } from "../../../../../supportedChains";
import { getFileContents } from "./contents/getFileContents";

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export async function getFile(
  chainId: number,
  filename: string,
): Promise<(OnchainFile & { contents: string }) | null> {
  const supportedChain = supportedChains.find((c) => c.chain.id === chainId);
  if (!supportedChain) {
    throw new Error("Unsupported chain");
  }

  const row = Array.from(
    await sql<
      {
        chainId: number;
        filename: string;
        createdAt: number;
        size: string;
        metadata: string;
      }[]
    >`
      SELECT
        chain_id as "chainId", filename, block_time as "createdAt", size, metadata
      FROM files_created
      WHERE chain_id = ${chainId} AND filename = ${filename}
      LIMIT 1
    `,
  ).find(() => true);

  if (!row) return null;

  const metadata = parseJson(row.metadata);
  const contents = await getFileContents(chainId, filename);

  return {
    chainId: row.chainId,
    filename: row.filename,
    createdAt: row.createdAt,
    size: parseInt(row.size), // a bigint but realistically never going to be >2gb
    type: metadata?.type ?? null,
    encoding: metadata?.encoding ?? null,
    compression: metadata?.compression ?? null,
    license: metadata?.license ?? null,
    contents,
  };
}
