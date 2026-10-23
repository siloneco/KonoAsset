import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

test(
  'ローカルファイルをアバター素体として登録し、元ファイルを保持する',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'アバター素体',
      metadata: 'avatars',
      mode: 'file',
    })
  },
)
