import { stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

async function findExecutable(candidates: string[]) {
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !('code' in error) ||
        !['ENOENT', 'ENOTDIR'].includes(String(error.code))
      )
        throw error
    }
  }
}

function pathCandidates(name: string) {
  return (process.env.PATH ?? '')
    .split(path.delimiter)
    .filter(Boolean)
    .map((directory) => path.resolve(directory.replace(/^"|"$/g, ''), name))
}

async function resolveExecutable(
  variable: string,
  name: string,
  fallback: string,
) {
  const override = process.env[variable]
  const candidates = override
    ? path.isAbsolute(override) || /[\\/]/.test(override)
      ? [path.resolve(projectRoot, override)]
      : pathCandidates(
          process.platform === 'win32' && !override.endsWith('.exe')
            ? `${override}.exe`
            : override,
        )
    : [...pathCandidates(name), path.join(projectRoot, fallback)]
  const executable = await findExecutable(candidates)
  if (executable) return executable
  throw new Error(
    `${name} was not found${override ? ` (${variable}=${override})` : ' on PATH or in the repository E2E tools'}. Set ${variable} to its executable path. Searched: ${candidates.join(', ')}`,
  )
}

/** Explicit environment overrides win, followed by PATH and locally prepared tools. */
export async function resolveDrivers() {
  const windows = process.platform === 'win32'
  const driver = await resolveExecutable(
    'TAURI_DRIVER',
    windows ? 'tauri-driver.exe' : 'tauri-driver',
    `src-backend/target/e2e-tools/bin/tauri-driver${windows ? '.exe' : ''}`,
  )
  const nativeDriver = await resolveExecutable(
    'TAURI_NATIVE_DRIVER',
    windows ? 'msedgedriver.exe' : 'WebKitWebDriver',
    windows
      ? 'src-backend/target/e2e-tools/edge/msedgedriver.exe'
      : 'src-backend/target/e2e-tools/bin/WebKitWebDriver',
  )
  return { driver, nativeDriver }
}
