"use server";

import { OnchainFile } from "../../../../common";
import { and, sql } from "../../../../database";

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export async function getFiles(
  chainId: number,
  filename?: string,
): Promise<OnchainFile[]> {
  const rows = Array.from(
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
      WHERE ${and(sql, [
        sql`chain_id = ${chainId}`,
        filename
          ? sql`filename ILIKE ${`%${filename.replace(
              /[%_]/g,
              "~$&",
            )}%`} ESCAPE '~'`
          : null,
      ])}
      ORDER BY block_time DESC
    `,
  );

  return rows.map((row) => {
    const metadata = parseJson(row.metadata) ?? {};

    // Fix gunzipScripts metadata on Sepolia:
    if (row.chainId === 11155111 && row.filename === "gunzipScripts-0.0.1.js") {
      metadata.type = "text/javascript";
      metadata.encoding = "base64";
    }

    return {
      chainId: row.chainId,
      filename: row.filename,
      createdAt: row.createdAt,
      size: parseInt(row.size), // a bigint but realistically never going to be >2gb
      type: metadata.type ?? null,
      encoding: metadata.encoding ?? null,
      compression: metadata.compression ?? null,
      license: metadata.license ?? null,
    };
  });
}
