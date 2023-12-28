import { hexToString } from "viem";

import { ponder } from "@/generated";

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

ponder.on("FileStore:FileCreated", async ({ event, context }) => {
  const { File } = context.db;

  const metadata = parseJson(hexToString(event.args.metadata));

  await File.create({
    id: `${context.network.chainId}:${event.args.filename}`,
    data: {
      chainId: context.network.chainId,
      name: event.args.filename,
      createdAt: Number(event.block.timestamp),
      size: Number(event.args.size),
      type: metadata?.type ?? null,
      encoding: metadata?.encoding ?? null,
      compression: metadata?.compression ?? null,
      license: metadata?.license ?? null,
    },
  });
});
