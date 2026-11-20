import React from 'react';
import { StatusLabel } from '../../shared/components/StatusLabel.jsx';

export function DataQualityBadge({ status }) {
  return <StatusLabel status={status} label={status === 'fresh' ? 'Verified Fresh' : status} />;
}
