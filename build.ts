import dts from 'bun-plugin-dts'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

// Build ESM + types
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  external: ['fs'],
  plugins: [dts()]
})

// Build CJS to temp, then move to dist/index.cjs
const tmpCjsDir = './.tmp-cjs'
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: tmpCjsDir,
  target: 'node',
  format: 'cjs',
  external: ['fs']
})

const cjsSource = join(tmpCjsDir, 'index.js')
const cjsDest = join('./dist', 'index.cjs')
if (!existsSync('./dist')) {
  mkdirSync('./dist', { recursive: true })
}
if (existsSync(cjsSource)) {
  renameSync(cjsSource, cjsDest)
}
if (existsSync(tmpCjsDir)) {
  rmSync(tmpCjsDir, { recursive: true, force: true })
}