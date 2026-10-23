import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

test(
  'ZIPを展開してワールドアセットとして登録する',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'ワールドアセット',
      metadata: 'worldObjects',
      mode: 'extract',
    })
  },
)
