import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const result = spawnSync(
  process.execPath,
  [
    path.join(root, 'node_modules/@tauri-apps/cli/tauri.js'),
    'build',
    '--debug',
    '--no-bundle',
    '--features',
    'e2e',
  ],
  {
    cwd: root,
    stdio: 'inherit',
    // Keep the E2E binary separate from regular dev/release builds.
    env: {
      ...process.env,
      CARGO_TARGET_DIR: path.join(root, 'src-backend/target/e2e'),
    },
  },
)
if (result.error) throw result.error
process.exit(result.status ?? 1)
