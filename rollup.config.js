import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/fbacc-plugin.js',
      format: 'iife',
      name: 'FBAdPlugin',
      sourcemap: !production
    },
    production && {
      file: 'dist/fbacc-plugin.min.js',
      format: 'iife',
      name: 'FBAdPlugin',
      plugins: [terser()],
      sourcemap: true
    }
  ].filter(Boolean),
  plugins: [
    resolve({
      browser: true
    }),
    commonjs()
  ]
};
