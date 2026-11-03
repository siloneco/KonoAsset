import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { clearFilters, expectAssets } from '../ui.ts'

// Given: A library containing overlapping names and shops.
// When: Use normal, advanced, and exclusion searches, then clear them.
// Then: Matching assets are displayed and clearing the search restores the library.
test(
  'Search asset names and shops and recover from an empty result',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, { initialData: library })
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    for (const [query, expected] of [
      ['Maple', ['Blouse', 'Coat']],
      ['-Maple', ['Aster', 'Desk', 'Effect']],
      ['存在しない商品', []],
    ] as const) {
      await browser
        .$('input[placeholder="キーワードを入力..."]')
        .setValue(query)
      await expectAssets(browser, [...expected])
    }
    await clearFilters(browser)
    await browser.$('div=詳細').click()
    await browser.$('input[placeholder="アセット名を入力..."]').setValue('Coat')
    await browser
      .$('input[placeholder="ショップ名を入力..."]')
      .setValue('Maple')
    await expectAssets(browser, ['Coat'])
    await browser
      .$('input[placeholder="アセット名を入力..."]')
      .setValue('-Coat')
    await expectAssets(browser, ['Blouse'])
    await clearFilters(browser)
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
  },
)
