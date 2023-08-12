import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert { type: 'json' };
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

/** @type {import('rollup').RollupOptions} */
const themeConfig = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        strict: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
        strict: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
  {
    // path to your declaration files root
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default themeConfig;
