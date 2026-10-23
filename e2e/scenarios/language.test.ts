import test from 'node:test'
import { startApp } from '../app.ts'
import { openSettings } from '../ui.ts'

test(
  '4言語を切り替えて表示を確認し、日本語の選択を再起動後も保持する',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t)
    await openSettings(app.browser)
    for (const [code, label, themeLabel] of [
      ['en-US', 'English (US)', 'Theme'],
      ['en-GB', 'English (UK)', 'Theme'],
      ['zh-CN', '简体中文', '主题'],
      ['ja-JP', '日本語', 'テーマ'],
    ]) {
      await app.browser.$('#preference-language').click()
      await app.browser
        .$(`//*[@role="option" and normalize-space(.)="${label}"]`)
        .click()
      await app.browser.waitUntil(
        async () =>
          (await app.browser.$('label[for="preference-theme"]').getText()) ===
            themeLabel && (await app.readPreference()).language === code,
        { timeoutMsg: `${label} が表示と保存値に反映されませんでした` },
      )
    }
    const browser = await app.restart()
    await openSettings(browser)
    await browser.waitUntil(
      async () =>
        (await browser.$('#preference-language').getText()) === '日本語',
      { timeoutMsg: '再起動後に日本語が復元されませんでした' },
    )
  },
)
