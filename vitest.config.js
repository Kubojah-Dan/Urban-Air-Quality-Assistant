import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@dayshift/contracts': path.resolve(__dirname, 'packages/contracts/src/index.js'),
      '@dayshift/domain': path.resolve(__dirname, 'packages/domain/src/index.js'),
      '@dayshift/guidance': path.resolve(__dirname, 'packages/guidance/src/index.js'),
      '@dayshift/ai': path.resolve(__dirname, 'packages/ai/src/index.js'),
      '@dayshift/data-sources': path.resolve(__dirname, 'packages/data-sources/src/index.js'),
      '@dayshift/shared': path.resolve(__dirname, 'packages/shared/src/index.js')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['**/*.test.jsx', 'jsdom'],
      ['apps/web/**', 'jsdom']
    ],
    include: [
      'tests/**/*.test.js',
      'tests/**/*.test.jsx',
      'packages/**/*.test.js',
      'packages/**/*.test.jsx',
      'apps/**/*.test.js',
      'apps/**/*.test.jsx'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/e2e/**',
      '**/*.spec.js'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 50,
        lines: 50,
        branches: 55,
        functions: 44
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        'tests/**',
        '**/*.spec.js',
        '**/*.config.js'
      ]
    }
  }
});
