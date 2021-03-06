// Copyright 2017-2021 @polkadot/apps, UseTech authors & contributors
// SPDX-License-Identifier: Apache-2.0

import markdown from '@jackfranklin/rollup-plugin-markdown';
import babel from '@rollup/plugin-babel';
import commonJs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typeScript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import html from 'rollup-plugin-html';
import i18next from 'rollup-plugin-i18next-conv';
import postcss from 'rollup-plugin-postcss';
// import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

// import ts from 'rollup-plugin-ts';
import pkg from './package.json';

const input = 'packages/index.ts';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const external = [
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.resolutions || {}),
  ...Object.keys(pkg.dependencies || {}),
  '@polkadot/ui-keyring',
  '@polkadot/wasm-crypto',
  '@polkadot/keyring',
  '@polkadot/hw-ledger',
  '@polkadot/types-known',
  '@polkadot/api-derive',
  '@polkadot/rpc-core',
  '@polkadot/types-known',
  '@polkadot/react-identicon'
];

const plugins = [
  nodeResolve({
    extensions,
    mainFields: ['module', 'main', 'jsnext:main', 'browser'],
    skip: external
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: ['node_modules/!**', 'jest/!**', 'docker/!**', 'cypress/!**', 'scripts/!**']
  }),
  del({ targets: ['dist/*'] }),
  html(),
  json(),
  postcss(),
  image(),
  i18next(),
  markdown(),
  // ts({}),
  typeScript({
    declaration: true,
    declarationDir: 'dist/',
    rootDir: 'packages/',
    tsconfig: './tsconfig.json'
  }),
  // sizeSnapshot(), // напишет в консоль размер бандла
  terser(),
  commonJs()
];

export default [
  {
    external,
    input,
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    plugins
  },
  {
    external,
    input,
    output: {
      dir: './dist',
      // file: pkg.main,
      format: 'umd',
      inlineDynamicImports: true,
      name: './dist/uiCore',
      sourcemap: true
    },
    plugins
  }
];
