import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export default defineConfig([
  {
    input: 'src/index.ts',
    platform: 'node',
    output: {
      dir: 'lib',
      format: 'esm',
      minify: true,
      inlineDynamicImports: true
    }
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
