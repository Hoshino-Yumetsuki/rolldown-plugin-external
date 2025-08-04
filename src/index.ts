import { isAbsolute } from 'node:path'
import { isBuiltin } from 'node:module'
import type { Plugin as RolldownPlugin } from 'rolldown'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const DependencyType = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
] as const

export interface PackageJsonExports {
  [key: string]: string | PackageJsonExports
}

export interface PackageJson
  extends Partial<
    Record<(typeof DependencyType)[number], Record<string, string>>
  > {
  name: string
  type?: 'module' | 'commonjs'
  main?: string
  module?: string
  bin?: string | Record<string, string>
  exports?: PackageJsonExports
  description?: string
  private?: boolean
  version: string
  workspaces?: string[]
  peerDependenciesMeta?: Record<string, { optional?: boolean }>
}

export const externalPlugin = ({
  manifest,
  cwd = process.cwd()
}: {
  manifest?: PackageJson
  cwd?: string
} = {}): RolldownPlugin => ({
  name: 'external-library',
  async resolveId(source: string, importer?: string) {
    const packageManifest =
      manifest ||
      (await readFile(join(cwd, 'package.json'), 'utf8')
        .then(JSON.parse)
        .catch(() => {
          throw new Error(`Failed to read package.json from ${cwd}`)
        }))
    if (!source) return null
    if (isAbsolute(source)) return null
    if (isBuiltin(source)) return { id: source, external: true }

    if (source.startsWith('.')) return null

    const name = source.startsWith('@')
      ? source.split('/', 2).join('/')
      : source.split('/', 1)[0]

    if (name === packageManifest.name) return { id: source, external: true }

    const types = new Set(
      DependencyType.filter((type) => packageManifest[type]?.[name])
    )
    if (types.size === 0) {
      throw new Error(`Missing dependency: ${name} from ${importer}`)
    }

    types.delete('devDependencies')
    return types.size > 0 ? { id: source, external: true } : null
  }
})
