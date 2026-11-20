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
    include: ['tests/**/*.test.js', 'packages/**/*.test.js', 'apps/**/*.test.js'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.spec.js']
  }
});
