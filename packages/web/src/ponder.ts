import * as schema from "@ethfs/ponder/ponder.schema";
import { createClient } from "@ponder/client";

// TODO: env
export const ponder = createClient(process.env.NEXT_PUBLIC_PONDER_URL!, {
  schema,
});
export { schema };
