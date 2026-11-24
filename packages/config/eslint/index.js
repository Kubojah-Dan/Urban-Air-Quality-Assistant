/**
 * Shared ESLint Rules for DayShift Workspace
 */
export const baseEslintRules = {
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'no-console': ['warn', { allow: ['info', 'warn', 'error'] }]
};

export default {
  rules: baseEslintRules
};
