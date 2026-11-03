import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { button, expectAssets } from '../ui.ts'

// Given: A library with known names, shops, and registration and publication dates.
// When: Change each sort order, select ascending asset names, and restart the app.
// Then: The displayed order matches each selection and the final sort persists.
test(
  'Sort assets by their dates, names, and shops and restore the final sort after restart',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { initialData: library })
    const { browser } = app
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await browser.$('[data-testid="status-bar-option-popover-trigger"]').click()
    for (const [sort, names] of [
      [
        '追加順 (新しいものから)',
        ['Effect', 'Desk', 'Coat', 'Blouse', 'Aster'],
      ],
      ['追加順 (古いものから)', ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect']],
      ['アセット名 (Z-A順)', ['Effect', 'Desk', 'Coat', 'Blouse', 'Aster']],
      ['アセット名 (A-Z順)', ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect']],
      ['ショップ名 (A-Z順)', ['Desk', 'Effect', 'Blouse', 'Coat', 'Aster']],
      ['ショップ名 (Z-A順)', ['Aster', 'Coat', 'Blouse', 'Effect', 'Desk']],
      [
        '商品公開日 (新しいものから)',
        ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'],
      ],
      [
        '商品公開日 (古いものから)',
        ['Effect', 'Desk', 'Coat', 'Blouse', 'Aster'],
      ],
    ] as const) {
      await browser.$(button(sort)).click()
      await expectAssets(browser, [...names], true)
    }
    await browser.$(button('アセット名 (A-Z順)')).click()
    await expectAssets(
      browser,
      ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'],
      true,
    )
    const next = await app.restart()
    await expectAssets(
      next,
      ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'],
      true,
    )
  },
)
