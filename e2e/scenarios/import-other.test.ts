import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

// Given: An empty library and an isolated ZIP archive.
// When: Disable extraction, enable source deletion, and import the ZIP.
// Then: The ZIP remains archived inside the asset and its original file is removed.
test(
  'Import an unextracted ZIP and delete the source using the saved import preferences',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'その他',
      metadata: 'otherAssets',
      mode: 'archive',
    })
  },
)
