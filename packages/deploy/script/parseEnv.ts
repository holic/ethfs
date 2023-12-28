import { z, ZodError, ZodTypeAny } from "zod";

export function parseEnv<TSchema extends ZodTypeAny>(
  envSchema: TSchema,
): z.infer<TSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      const { _errors, ...invalidEnvVars } = error.format();
      console.error(
        `\nMissing or invalid environment variables:\n\n  ${Object.keys(
          invalidEnvVars,
        ).join("\n  ")}\n`,
      );
      process.exit(1);
    }
    throw error;
  }
}
