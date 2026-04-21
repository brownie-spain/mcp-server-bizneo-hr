import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  BIZNEO_API_TOKEN: z.string().min(1, 'BIZNEO_API_TOKEN is required'),
  BIZNEO_API_BASE_URL: z.string().url().default('https://connect.bizneo.com/hcm'),
  BIZNEO_RATE_LIMIT_RPS: z.coerce.number().int().positive().default(10),
  BIZNEO_RATE_LIMIT_CONCURRENT: z.coerce.number().int().positive().default(5),
  MCP_TRANSPORT: z.enum(['stdio', 'http']).default('stdio'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`Invalid configuration:\n${errors}`);
  }
  return result.data;
}

export const config = loadConfig();
