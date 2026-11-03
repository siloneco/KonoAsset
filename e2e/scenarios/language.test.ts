import test from 'node:test'
import { startApp } from '../app.ts'
import { openSettings } from '../ui.ts'

// Given: An app with the bundled language options.
// When: Select each language, return to Japanese, and restart.
// Then: Labels follow the selection and the saved Japanese language is restored.
test(
  'Switch bundled languages and restore the selected language after restart',
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
