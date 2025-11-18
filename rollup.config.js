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
    {
      file: 'dist/fbacc-plugin.min.js',
      format: 'iife',
      name: 'FBAdPlugin',
      plugins: production ? [terser()] : [],
      sourcemap: production
    }
  ],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    production && terser()
  ]
};
