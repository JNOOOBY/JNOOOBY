// typescript-eslint does not yet support TypeScript 7, so this config uses
// the official Next.js ESLint plugin directly. Type correctness is enforced
// by `next build` (tsc).
import nextPlugin from '@next/eslint-plugin-next';

const eslintConfig = [
  nextPlugin.configs['core-web-vitals'],
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/generated/**',
    ],
  },
];

export default eslintConfig;
