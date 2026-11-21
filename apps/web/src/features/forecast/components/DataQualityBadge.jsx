import React from 'react';
import { StatusLabel } from '../../shared/components/StatusLabel.jsx';

export function DataQualityBadge({ status, label }) {
  return <StatusLabel status={status || 'valid'} label={label} />;
}
