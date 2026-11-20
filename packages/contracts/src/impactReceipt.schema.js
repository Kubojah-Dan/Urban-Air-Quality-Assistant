import { z } from 'zod';

export const OutdoorContextReceiptSchema = z.object({
  pollutant: z.string(),
  timeWindow: z.string(),
  relativeTrend: z.enum(['improving', 'stable', 'worsening', 'unknown']),
  sourceLabel: z.string(),
  coverage: z.string(),
  caveats: z.array(z.string())
});

export const IndoorActionReceiptSchema = z.object({
  actionTitle: z.string(),
  mechanism: z.enum(['source_control', 'exhaust_ventilation', 'filtration', 'none']),
  prerequisites: z.array(z.string()),
  avoidWhen: z.array(z.string())
});

export const EmissionsReceiptSchema = z.object({
  status: z.enum(['estimated', 'not_estimated']),
  factorId: z.string().optional(),
  activityClass: z.string().optional(),
  estimatedTailpipeCo2GramsSaved: z.number().nullable().optional(),
  factorSource: z.string().optional(),
  factorVintage: z.string().optional(),
  note: z.string()
});

export const ImpactReceiptSchema = z.object({
  id: z.string(),
  baselineId: z.string(),
  outdoorContext: OutdoorContextReceiptSchema,
  indoorAction: IndoorActionReceiptSchema,
  emissionsEstimate: EmissionsReceiptSchema,
  assumptions: z.array(z.string()),
  unknowns: z.array(z.string())
});
