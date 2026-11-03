import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { button, card, expectAssets, waitForUi } from '../ui.ts'

// Given: A library with several assets and the default display layout.
// When: Select each layout, finish with the list layout, and restart the app.
// Then: Asset sizes change and the selected list layout is restored.
test(
  'Change the asset list layout and restore it after restarting',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { initialData: library })
    const { browser } = app
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await browser.$('[data-testid="status-bar-option-popover-trigger"]').click()
    let previousWidth = 0
    for (const size of ['大', '中', '小', 'リスト']) {
      await browser.$(button(size)).click()
      await browser.waitUntil(
        async () => {
          const width = await browser.$(card('Aster')).getSize('width')
          return (
            width > 0 &&
            width !== previousWidth &&
            (await browser.$(button(size)).getAttribute('aria-pressed')) ===
              'true'
          )
        },
        { timeoutMsg: `${size} に表示サイズが変わりませんでした` },
      )
      previousWidth = await browser.$(card('Aster')).getSize('width')
    }
    const next = await app.restart()
    await expectAssets(next, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await next.$('[data-testid="status-bar-option-popover-trigger"]').click()
    await waitForUi(
      next,
      async () => next.$(button('リスト')).getAttribute('aria-pressed'),
      'true',
    )
  },
)
