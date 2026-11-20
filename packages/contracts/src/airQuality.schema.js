import { z } from 'zod';

export const RecordKindSchema = z.enum(['observation', 'forecast', 'index']);

export const QualityFlagSchema = z.enum([
  'valid',
  'preliminary',
  'stale',
  'estimated',
  'unsupported',
  'sensor_offline'
]);

export const AirQualityRecordSchema = z.object({
  id: z.string(),
  provider: z.enum(['open-meteo', 'airnow', 'cpcb', 'openaq']),
  recordKind: RecordKindSchema,
  stationId: z.string().optional(),
  modelId: z.string().optional(),
  pollutant: z.string(),
  value: z.number(),
  unit: z.string(),
  validAt: z.string().datetime(),
  retrievedAt: z.string().datetime(),
  issuedAt: z.string().datetime().optional(),
  coverage: z.string(),
  qualityFlags: z.array(QualityFlagSchema).default(['valid']),
  attribution: z.string()
});

export const AirQualityBundleSchema = z.object({
  locationContext: z.any(),
  records: z.array(AirQualityRecordSchema),
  freshnessState: z.enum(['fresh', 'stale', 'expired']),
  retrievedAt: z.string().datetime()
});
