import test from 'node:test'
import { importScenario } from '../import-scenario.ts'

test(
  'フォルダをアバター関連アセットとして登録して内部ファイルも取り込める',
  { timeout: 90_000 },
  async (t) => {
    await importScenario(t, {
      type: 'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
      metadata: 'avatarWearables',
      mode: 'folder',
    })
  },
)
