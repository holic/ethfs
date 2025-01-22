import { ponder } from "ponder:registry";
import { file } from "ponder:schema";
import { hexToString } from "viem";

ponder.on("FileStore:FileCreated", async ({ event, context }) => {
  await context.db.insert(file).values({
    chainId: context.network.chainId,
    createdAt: event.block.timestamp,
    filename: event.args.filename,
    pointer: event.args.pointer,
    size: event.args.size,
    metadata: hexToString(event.args.metadata),
  });
});
