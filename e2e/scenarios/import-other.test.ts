import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

test(
  '設定と追加画面の削除指定を同期し、ZIPを展開せず登録して元ZIPを削除する',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'その他',
      metadata: 'otherAssets',
      mode: 'archive',
    })
  },
)
