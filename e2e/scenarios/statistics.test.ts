import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { button, openSettings, waitForUi, type Browser } from '../ui.ts'

// Given: A library with known asset types and file sizes.
// When: Inspect the statistics and reload the renderer and restart the app.
// Then: Counts and disk usage still agree with the library after each reload.
test(
  'Inspect asset counts and disk usage before and after reloading and restarting',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { initialData: library })
    const { browser } = app
    await openSettings(browser, '統計')
    for (const [label, count] of [
      ['アセット登録数', 5],
      ['アバター素体', 1],
      ['アバター関連アセット', 2],
      ['ワールドアセット', 1],
      ['その他', 1],
    ] as const) {
      await browser.waitUntil(
        async () =>
          (
            await browser
              .$(
                `[role="group"][aria-label="${label}"] [data-slot="card-content"]`,
              )
              .getText()
          ).startsWith(String(count)),
        { timeoutMsg: `${label} did not show ${count} assets` },
      )
    }
    await browser
      .$('[role="application"][aria-label="タイプごとのアセット登録数"]')
      .click()
    for (const [key, expected] of [
      ['ArrowRight', 'アバター関連アセット2'],
      ['ArrowLeft', 'アバター素体1'],
    ]) {
      await browser.keys(key)
      await browser.waitUntil(
        async () => {
          const tooltip = browser.$(
            '[data-testid="asset-type-chart"] .recharts-tooltip-wrapper',
          )
          return (
            (await tooltip.isDisplayed()) &&
            (await tooltip.getText()).replace(/\s+/g, '').includes(expected)
          )
        },
        { timeoutMsg: `The type chart did not show ${expected}` },
      )
    }

    async function expectDiskUsage(browser: Browser) {
      await waitForUi(
        browser,
        async () =>
          browser
            .$('[data-testid="asset-disk-usage"]')
            .getAttribute('aria-busy'),
        'false',
      )
      await browser.waitUntil(
        async () => {
          const text = await browser
            .$('[data-testid="asset-disk-usage"]')
            .getText()
          return assets.every((asset) => text.includes(asset.name))
        },
        {
          timeoutMsg: 'The disk usage chart did not show the registered assets',
        },
      )
      await browser
        .$('[data-testid="asset-disk-usage"] path[name="Blouse"]')
        .scrollIntoView()
      await browser.waitUntil(
        async () => {
          await browser
            .$('[data-testid="asset-disk-usage"] [data-slot="card-title"]')
            .moveTo()
          await browser
            .$('[data-testid="asset-disk-usage"] path[name="Blouse"]')
            .moveTo()
          const tooltip = browser.$(
            '[data-testid="asset-disk-usage"] .recharts-tooltip-wrapper',
          )
          const text = await tooltip.getText()
          return (
            (await tooltip.isDisplayed()) &&
            text.includes('Blouse') &&
            text.includes('14 Bytes')
          )
        },
        {
          timeoutMsg:
            'The disk usage tooltip did not show the asset name and size',
        },
      )
    }

    await expectDiskUsage(browser)
    // A renderer reload and a Rust-process restart exercise different lifecycles.
    await browser.refresh()
    await browser.$('#preference-theme').waitForDisplayed()
    await browser.$(button('統計')).click()
    await expectDiskUsage(browser)
    const restarted = await app.restart()
    await openSettings(restarted, '統計')
    await expectDiskUsage(restarted)
  },
)
