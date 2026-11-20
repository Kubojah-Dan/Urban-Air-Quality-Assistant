import { z } from 'zod';

export const ModelOutputSchema = z.object({
  nextQuestion: z.string().nullable().optional(),
  rankedCandidateIds: z.array(z.string()),
  reasonCodes: z.array(z.string()),
  evidenceIds: z.array(z.string()),
  missingInputs: z.array(z.string()).default([]),
  explanation: z.string()
});

export const ModelMetadataSchema = z.object({
  provider: z.enum(['google', 'groq', 'deterministic_fallback']),
  model: z.string(),
  fallbackTriggered: z.boolean().default(false),
  fallbackReason: z.string().optional()
});
