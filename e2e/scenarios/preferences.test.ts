import test from 'node:test'
import { startApp } from '../app.ts'
import { openSettings } from '../ui.ts'

test(
  'ファイル操作の設定を変更して保存し、再起動後に復元できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t)
    await openSettings(app.browser)
    const switches = [
      ['Unitypackageを優先して開く', 'useUnitypackageSelectedOpen', false],
      ['インポート後に元ファイル/フォルダを削除する', 'deleteOnImport', true],
      ['ZIPファイルを自動で展開する', 'zipExtraction', false],
      ['ゴミ箱を使用する', 'useTrashBin', false],
    ] as const
    for (const [label, key, value] of switches) {
      await app.browser.$(`[role="switch"][aria-label="${label}"]`).click()
      await app.browser.waitUntil(
        async () =>
          (await app.browser
            .$(`[role="switch"][aria-label="${label}"]`)
            .getAttribute('aria-checked')) === String(value) &&
          (await app.readPreference())[key] === value,
        { timeoutMsg: `${label} が保存されませんでした` },
      )
    }
    const browser = await app.restart()
    await openSettings(browser)
    for (const [label, , value] of switches) {
      await browser.waitUntil(
        async () =>
          (await browser
            .$(`[role="switch"][aria-label="${label}"]`)
            .getAttribute('aria-checked')) === String(value),
        { timeoutMsg: `${label} が再起動後に復元されませんでした` },
      )
    }
  },
)
