import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(__dirname, '../../');

const SENSITIVE_PATTERNS = [
  { name: 'Private Key', regex: /-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY-----/ },
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
  { name: 'OpenAI Secret Key', regex: /sk-[a-zA-Z0-9]{32,}/ },
  { name: 'GitHub Personal Access Token', regex: /ghp_[0-9a-zA-Z]{36}/ },
  { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/ }
];

const IGNORED_SEGMENTS = [
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.vite',
  '.turbo',
  '.env',
  '.env.local',
  '.env.example',
  'package-lock.json',
  'pnpm-lock.yaml',
  'tests/security/secret-scanning.test.js',
  'tests/helpers/authTestTokens.js'
];

function shouldIgnore(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return IGNORED_SEGMENTS.some(
    (ignored) =>
      normalized === ignored ||
      normalized.startsWith(ignored + '/') ||
      normalized.includes('/' + ignored + '/') ||
      normalized.endsWith('/' + ignored)
  );
}

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(REPO_ROOT, fullPath).replace(/\\/g, '/');

    if (shouldIgnore(relPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      fileList.push({ fullPath, relPath });
    }
  }
  return fileList;
}

describe('Security: Automated Repository Secret Scanning', () => {
  it('verifies that .env is strictly ignored in .gitignore', () => {
    const gitignorePath = path.join(REPO_ROOT, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    expect(gitignoreContent).toMatch(/\.env/);
  });

  it('scans all repository source files and confirms zero hardcoded secrets or API keys', () => {
    const files = getAllFiles(REPO_ROOT);
    expect(files.length).toBeGreaterThan(10);

    const violations = [];

    for (const { fullPath, relPath } of files) {
      // Skip binary files or media assets
      if (/\.(png|jpg|jpeg|webp|ico|svg|woff2?|ttf|eot|lock)$/i.test(relPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');

      for (const pattern of SENSITIVE_PATTERNS) {
        if (pattern.regex.test(content)) {
          // Never log the matched secret in test outputs for security
          violations.push({
            file: relPath,
            rule: pattern.name
          });
        }
      }
    }

    if (violations.length > 0) {
      const summary = violations.map((v) => `${v.file}: flagged by rule ${v.rule}`).join('\n');
      expect.fail(`Secret scanning detected unredacted sensitive signatures:\n${summary}`);
    }

    expect(violations).toEqual([]);
  });

  it('ensures .env.example contains only placeholders without real credentials', () => {
    const examplePath = path.join(REPO_ROOT, '.env.example');
    if (fs.existsSync(examplePath)) {
      const content = fs.readFileSync(examplePath, 'utf8');
      expect(content).not.toMatch(/AIza[0-9A-Za-z-_]{35}/);
      expect(content).toMatch(/GEMINI_API_KEY=/);
    }
  });
});
