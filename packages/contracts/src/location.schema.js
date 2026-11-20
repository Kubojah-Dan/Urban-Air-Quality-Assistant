import { z } from 'zod';

export const LocationContextSchema = z.object({
  countryCode: z.string().length(2),
  regionId: z.string().min(1),
  cityId: z.string().min(1),
  displayName: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timeZone: z.string().default('UTC'),
  gridCellId: z.string().optional()
});

export const PlaceSearchResultSchema = z.array(LocationContextSchema);
