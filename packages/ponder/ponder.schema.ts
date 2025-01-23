import { onchainTable, primaryKey } from "ponder";

export const file = onchainTable(
  "files",
  (t) => ({
    chainId: t.integer().notNull(),
    createdAt: t.bigint().notNull(),
    filename: t.text().notNull(),
    pointer: t.hex().notNull(),
    size: t.bigint().notNull(),
    metadata: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.filename] }),
  }),
);
