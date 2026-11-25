import { z } from 'zod';

export const OutdoorContextReceiptSchema = z.object({
  pollutant: z.string(),
  timeWindow: z.string().optional(),
  windowDescription: z.string().optional(),
  value: z.number().nullable().optional(),
  unit: z.string().optional(),
  status: z.enum(['measured', 'forecast', 'cached', 'stale', 'expired', 'unavailable']).optional(),
  recordKind: z.string().optional(),
  relativeTrend: z.enum(['improving', 'stable', 'worsening', 'unknown']).optional(),
  sourceLabel: z.string().optional(),
  coverage: z.string().optional(),
  note: z.string().optional(),
  caveats: z.array(z.string()).optional()
}).passthrough();

export const IndoorActionReceiptSchema = z.object({
  actionTitle: z.string(),
  mechanism: z.enum(['source_control', 'exhaust_ventilation', 'filtration', 'none']),
  prerequisites: z.array(z.string()),
  avoidWhen: z.array(z.string())
}).passthrough();

export const EmissionsReceiptSchema = z.object({
  status: z.enum(['estimated', 'not_estimated']),
  factorId: z.string().optional(),
  activityClass: z.string().optional(),
  estimatedTailpipeCo2GramsSaved: z.number().nullable().optional(),
  factorSource: z.string().optional(),
  factorVintage: z.string().optional(),
  basis: z.string().optional(),
  calculationBoundary: z.string().optional(),
  note: z.string()
}).passthrough();

export const ImpactReceiptSchema = z.object({
  id: z.string(),
  baselineId: z.string(),
  outdoorContext: OutdoorContextReceiptSchema,
  indoorAction: IndoorActionReceiptSchema,
  emissionsEstimate: EmissionsReceiptSchema,
  assumptions: z.array(z.string()),
  unknowns: z.array(z.string())
}).passthrough();
