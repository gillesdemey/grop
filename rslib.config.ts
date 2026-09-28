import { defineConfig } from '@rslib/core';

// Match the `engines` floor: the oldest Node.js line this ESM-only package supports.
export default defineConfig({
  lib: [{ format: 'esm', syntax: ['node 12.20'], dts: true }],
});
