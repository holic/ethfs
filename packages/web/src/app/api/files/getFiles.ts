"use server";

import { and, sql } from "../../../database";

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export type GetFilesResult = Awaited<ReturnType<typeof getFiles>>;

export async function getFiles(filename?: string) {
  const rows = Array.from(
    await sql<
      {
        filename: string;
        createdAt: number;
        size: string;
        metadata: string;
      }[]
    >`
      SELECT
        filename, block_time as "createdAt", size, metadata
      FROM files_created
      WHERE ${and(sql, [
        sql`chain_id = 5`,
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

  return rows.map((row) => ({
    filename: row.filename,
    createdAt: row.createdAt,
    size: parseInt(row.size), // a bigint but realistically never going to be >2gb
    metadata: parseJson(row.metadata) as {
      type?: string;
      encoding?: string;
      compression?: string;
      license?: string;
    } | null,
  }));
}
