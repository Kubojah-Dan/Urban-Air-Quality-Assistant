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
