import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

const outputConfig = {
  minify: true,
  inlineDynamicImports: true
}

export default defineConfig([
  {
    input: 'src/index.ts',
    platform: 'node',
    output: [
      { ...outputConfig, file: 'lib/index.mjs', format: 'esm' },
      { ...outputConfig, file: 'lib/index.cjs', format: 'cjs' }
    ]
  },
  {
    input: 'src/index.ts',
    platform: 'node',
    output: {
      dir: 'lib',
      format: 'esm',
      inlineDynamicImports: true
    },
    plugins: [dts({ emitDtsOnly: true })]
  }
])
