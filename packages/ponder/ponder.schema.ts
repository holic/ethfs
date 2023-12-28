import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  File: p.createTable({
    id: p.string(),
    chainId: p.int(),
    name: p.string(),
    createdAt: p.int(),
    size: p.int(),
    type: p.string().optional(),
    encoding: p.string().optional(),
    compression: p.string().optional(),
    license: p.string().optional(),
  }),
}));
