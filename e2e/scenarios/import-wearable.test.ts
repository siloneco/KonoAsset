import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

// Given: An empty library and a folder containing a nested file.
// When: Import the folder as an avatar wearable.
// Then: The asset can be reopened for editing and the nested file and source remain intact.
test(
  'Import a wearable folder and preserve its nested files',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
      metadata: 'avatarWearables',
      mode: 'folder',
    })
  },
)
