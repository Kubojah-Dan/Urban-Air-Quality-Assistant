import { z } from 'zod';
import { CandidateOptionSchema } from './candidate.schema.js';
import { ImpactReceiptSchema } from './impactReceipt.schema.js';
import { ModelMetadataSchema } from './modelOutput.schema.js';
import { EvidenceBundleSchema } from './evidence.schema.js';

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('dayshift-api'),
  timestamp: z.string().datetime(),
  version: z.string()
});

export const RecommendationResponseSchema = z.object({
  baselineId: z.string(),
  candidates: z.object({
    usual: CandidateOptionSchema,
    recommended: CandidateOptionSchema,
    backup: CandidateOptionSchema
  }),
  impactReceipts: z.record(ImpactReceiptSchema),
  evidence: EvidenceBundleSchema,
  modelInfo: ModelMetadataSchema,
  degradedMode: z.boolean().default(false)
});

export const AssistantChatRequestSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty').max(2000),
  city: z
    .object({
      displayName: z.string().optional(),
      cityId: z.string().optional(),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      countryCode: z.string().optional()
    })
    .optional(),
  context: z.record(z.any()).optional()
});

export const AssistantChatResponseSchema = z.object({
  reply: z.string(),
  provider: z.string(),
  model: z.string(),
  evidence: z.object({
    city: z.string(),
    pm25: z.number().nullable(),
    pm10: z.number().nullable(),
    no2: z.number().nullable(),
    o3: z.number().nullable(),
    category: z.string(),
    source: z.string()
  })
});
