import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

// Given: An empty library and a local avatar file.
// When: Cancel the first file selection, then import the file as an avatar.
// Then: The asset can be reopened for editing and the source remains intact.
test(
  'Import a local avatar file and retain the source file',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'アバター素体',
      metadata: 'avatars',
      mode: 'file',
    })
  },
)
