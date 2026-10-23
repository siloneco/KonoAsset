import assert from 'node:assert/strict'
import test from 'node:test'
import { startApp } from './app.ts'
import type { Theme } from '../src/lib/bindings.ts'

test(
  '日本語の設定画面で Light / Dark Theme を切り替えて保存する',
  { timeout: 90_000 },
  async (t) => {
    const { browser, readPreference } = await startApp(t)

    // This button is on the main page: reaching it also verifies setup was skipped.
    const settingsButton = browser.$('button[aria-label="一般設定"]')
    await settingsButton.waitForDisplayed()
    assert.equal(new URL(await browser.getUrl()).pathname, '/')
    await settingsButton.click()

    let themeSelector = browser.$('#preference-theme')
    await themeSelector.waitForDisplayed()
    assert.equal(
      await browser.$('label[for="preference-theme"]').getText(),
      'テーマ',
    )

    async function expectTheme(theme: Exclude<Theme, 'system'>, label: string) {
      await browser.waitUntil(
        async () => {
          const classes = (
            (await browser.$('html').getAttribute('class')) ?? ''
          ).split(/\s+/)
          return (
            classes.includes(theme) &&
            !classes.includes(theme === 'dark' ? 'light' : 'dark') &&
            (await themeSelector.getText()) === label &&
            (await readPreference()).theme === theme
          )
        },
        {
          timeoutMsg: `${label} が画面と preference.json に反映されませんでした`,
        },
      )
      assert.equal((await readPreference()).language, 'ja-JP')
    }

    await expectTheme('light', 'ライト')
    for (const [theme, label] of [
      ['dark', 'ダーク'],
      ['light', 'ライト'],
    ] as const) {
      await themeSelector.click()
      await browser
        .$(`//*[@role="option" and normalize-space(.)="${label}"]`)
        .click()
      await expectTheme(theme, label)
    }

    // Reload the renderer to verify the saved setting is loaded from the backend.
    await browser.refresh()
    themeSelector = browser.$('#preference-theme')
    await themeSelector.waitForDisplayed()
    await expectTheme('light', 'ライト')
  },
)
