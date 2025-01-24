import { Hono } from "hono";
import { and, client, desc, eq, graphql, ilike } from "ponder";
import { db, publicClients } from "ponder:api";
import schema from "ponder:schema";
import { hexToString } from "viem";

import type { OnchainFile } from "../common";

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

const chainIds = new Set(
  Object.keys(publicClients).map((chainId) => parseInt(chainId)),
);

const app = new Hono();

app.use("/graphql", graphql({ db, schema }));
app.use(client({ db }));

app.get("/api/:chainId/files", async (c) => {
  const chainId = parseInt(c.req.param("chainId"));
  if (!chainIds.has(chainId)) {
    throw new Error("Unsupported chain");
  }

  const searchQuery = c.req.query("filename");

  const rows = await db
    .select()
    .from(schema.file)
    .where(
      and(
        eq(schema.file.chainId, chainId),
        searchQuery
          ? ilike(schema.file.filename, `%${searchQuery}%`)
          : undefined,
      ),
    )
    .orderBy(desc(schema.file.createdAt));

  return c.json(
    rows.map((row): OnchainFile => {
      const metadata: {
        type?: string;
        encoding?: string;
        compression?: string;
        license?: string;
      } = parseJson(hexToString(row.metadata)) ?? {};

      // Fix gunzipScripts metadata on Sepolia:
      if (
        row.chainId === 11155111 &&
        row.filename === "gunzipScripts-0.0.1.js"
      ) {
        metadata.type = "text/javascript";
        metadata.encoding = "base64";
      }

      return {
        chainId: row.chainId,
        filename: row.filename,
        createdAt: Number(row.createdAt), // a Unix timestamp stored in a uint256 onchain :(
        size: Number(row.size), // emitted as uint256, but realistically never going to be >2gb
        type: metadata.type ?? null,
        encoding: metadata.encoding ?? null,
        compression: metadata.compression ?? null,
        license: metadata.license ?? null,
      };
    }),
  );
});

export default app;
