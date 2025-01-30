import { z, ZodError, ZodTypeAny } from "zod";
import { createMessageBuilder } from "zod-validation-error";

const formatError = createMessageBuilder({
  prefix: null,
  issueSeparator: "\n",
  unionSeparator: "\nor\n",
});

export function parseEnv<TSchema extends ZodTypeAny>(
  envSchema: TSchema,
): z.infer<TSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(
        `Missing or invalid environment variables:\n\n${formatError(error.issues as never)}\n`,
      );
      process.exit(1);
    }
    throw error;
  }
}
