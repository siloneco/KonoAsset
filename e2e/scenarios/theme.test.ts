import assert from 'node:assert/strict'
import test from 'node:test'
import { startApp } from '../app.ts'
import type { Theme } from '../../src/lib/bindings.ts'

test(
  'ライト・ダーク・システム設定のテーマを切り替え、再起動後も保持する',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t)
    const { browser, readPreference } = app

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
            (await browser.$('#preference-theme').getText()) === label &&
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
    const systemDark = await browser.execute(
      () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    )
    const oppositeLabel = systemDark ? 'ライト' : 'ダーク'
    await browser.$('#preference-theme').click()
    await browser
      .$(`//*[@role="option" and normalize-space(.)="${oppositeLabel}"]`)
      .click()
    await expectTheme(systemDark ? 'light' : 'dark', oppositeLabel)
    await browser.$('#preference-theme').click()
    await browser
      .$('//*[@role="option" and normalize-space(.)="システム設定を利用"]')
      .click()
    await browser.waitUntil(
      async () =>
        (await readPreference()).theme === 'system' &&
        ((await browser.$('html').getAttribute('class')) ?? '')
          .split(/\s+/)
          .includes(systemDark ? 'dark' : 'light'),
      { timeoutMsg: 'システム設定のテーマが適用・保存されませんでした' },
    )
    const next = await app.restart()
    await next.$('button[aria-label="一般設定"]').click()
    await next.$('#preference-theme').waitForDisplayed()
    assert.equal(
      await next.$('#preference-theme').getText(),
      'システム設定を利用',
    )
  },
)
