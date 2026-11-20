import { z } from 'zod';
import { AirQualityRecordSchema } from './airQuality.schema.js';

export const EvidenceBundleSchema = z.object({
  id: z.string(),
  locationContextId: z.string(),
  records: z.array(AirQualityRecordSchema),
  limitations: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  freshnessState: z.enum(['fresh', 'stale', 'expired'])
});
