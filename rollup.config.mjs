import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert { type: 'json' };
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
const themeConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      strict: false,
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'named',
      strict: false,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      sourceMap: true,
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};

export default themeConfig;
