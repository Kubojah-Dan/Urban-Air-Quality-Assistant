import { DATA_SOURCE_REGISTRY } from './registry.js';

export function getProviderCapabilities(providerId) {
  return DATA_SOURCE_REGISTRY[providerId] || null;
}
