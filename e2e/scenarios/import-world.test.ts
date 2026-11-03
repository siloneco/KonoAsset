import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

// Given: An empty library and an isolated ZIP archive.
// When: Import the ZIP as a world asset with extraction enabled.
// Then: The extracted content is available and the original ZIP remains intact.
test(
  'Extract a ZIP when importing it as a world asset',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'ワールドアセット',
      metadata: 'worldObjects',
      mode: 'extract',
    })
  },
)
