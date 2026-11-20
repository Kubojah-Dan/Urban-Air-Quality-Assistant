import { describe, it, expect } from 'vitest';
import { AirQualityRecordSchema } from '@dayshift/contracts';
import { mapOpenMeteoToRecord } from '../../apps/api/src/infrastructure/data-sources/openMeteo/openMeteo.mapper.js';

describe('Provider Data Contracts', () => {
  it('maps Open-Meteo payload into valid AirQualityRecord schema', () => {
    const rawMock = {
      current: {
        time: '2026-11-20T10:00:00Z',
        pm2_5: 45.2,
        pm10: 80.5
      }
    };

    const record = mapOpenMeteoToRecord(rawMock);
    const parsed = AirQualityRecordSchema.safeParse(record);
    expect(parsed.success).toBe(true);
    expect(record.provider).toBe('open-meteo');
    expect(record.recordKind).toBe('forecast');
  });
});
