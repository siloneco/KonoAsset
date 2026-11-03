import test from 'node:test'
import { startApp } from '../app.ts'
import { openSettings, setPreferenceSwitch } from '../ui.ts'

// Given: An app with known initial file operation preferences.
// When: Change each file operation switch and restart.
// Then: Each displayed and persisted switch value matches the selection.
test(
  'Save file operation preferences and restore them after restart',
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
      await setPreferenceSwitch(app, label, key, value)
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
