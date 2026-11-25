import { z } from 'zod';

export const CandidateOptionSchema = z.object({
  id: z.string(),
  kind: z.enum(['usual', 'recommended', 'backup']),
  title: z.string(),
  description: z.string(),
  changes: z.array(z.string()),
  satisfiedConstraints: z.array(z.string()),
  tradeoffs: z.array(z.string()),
  evidenceIds: z.array(z.string()),
  impactReceiptId: z.string(),
  departureMinutes: z.number().optional(),
  arrivalMinutes: z.number().optional(),
  departureWindow: z.object({ start: z.string(), end: z.string() }).optional(),
  arrivalWindow: z.object({ start: z.string(), end: z.string() }).optional(),
  requiresTransit: z.boolean().optional(),
  incursFinancialCost: z.boolean().optional(),
  eveningCommute: z.any().optional(),
  schedule: z.array(z.any()).optional()
}).passthrough();
