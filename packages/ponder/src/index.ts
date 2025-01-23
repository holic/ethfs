import { ponder } from "ponder:registry";
import { file } from "ponder:schema";

ponder.on("FileStore:FileCreated", async ({ event, context }) => {
  await context.db.insert(file).values({
    chainId: context.network.chainId,
    createdAt: event.block.timestamp,
    filename: event.args.filename,
    pointer: event.args.pointer,
    size: event.args.size,
    metadata: event.args.metadata,
  });
});
