import { z } from "zod";

export const verifierEnvSchema = z.union([
  z.object({
    VERIFIER: z.literal("etherscan"),
    VERIFIER_URL: z.undefined().optional(),
    VERIFIER_API_KEY: z.string(),
  }),
  z.object({
    VERIFIER: z.literal("blockscout"),
    VERIFIER_URL: z.string(),
    VERIFIER_API_KEY: z.string().optional(),
  }),
]);

export type VerifierEnv = z.infer<typeof verifierEnvSchema>;
