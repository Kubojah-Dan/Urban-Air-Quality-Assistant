import { z } from 'zod';

export const ActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['commute', 'outdoor_activity', 'indoor_routine', 'errand']),
  startWindow: z.string(),
  endWindow: z.string(),
  isFlexible: z.boolean().default(false),
  mode: z.enum(['walk', 'transit', 'car', 'bike', 'other']).optional()
});

export const ConstraintSchema = z.object({
  id: z.string(),
  type: z.enum(['hard', 'soft']),
  description: z.string(),
  parameter: z.string(),
  value: z.any()
});

export const RoutineBaselineSchema = z.object({
  id: z.string(),
  activities: z.array(ActivitySchema),
  constraints: z.array(ConstraintSchema),
  cityId: z.string(),
  createdAt: z.string().datetime()
});
