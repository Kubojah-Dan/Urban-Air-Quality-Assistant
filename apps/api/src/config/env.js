import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, '../../../../.env');
const localEnvPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else {
  dotenv.config();
}

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  AI_PRIMARY_PROVIDER: z.string().default('google'),
  AI_FALLBACK_PROVIDER: z.string().default('groq'),
  AI_ENABLE_FALLBACK: z.coerce.boolean().default(true),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
  MODEL_REQUEST_TIMEOUT_MS: z.coerce.number().default(12000),
  MODEL_MAX_OUTPUT_TOKENS: z.coerce.number().default(1200),
  MODEL_MAX_RETRIES_PER_PROVIDER: z.coerce.number().default(1),
  OPEN_METEO_BASE_URL: z.string().default('https://air-quality-api.open-meteo.com/v1/air-quality'),
  AIRNOW_API_KEY: z.string().optional(),
  CPCB_API_KEY: z.string().optional(),
  CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
  REDIS_URL: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().default('dayshift-c76c2'),
  LOG_LEVEL: z.string().default('info')
});

export const env = EnvSchema.parse(process.env);
