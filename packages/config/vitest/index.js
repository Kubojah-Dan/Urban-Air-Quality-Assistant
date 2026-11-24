/**
 * Shared Vitest Base Configuration for DayShift Workspace
 */
export const baseVitestConfig = {
  globals: true,
  environment: 'node',
  testTimeout: 20000,
  hookTimeout: 20000
};

export default baseVitestConfig;
