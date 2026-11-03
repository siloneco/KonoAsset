import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { chooseFilter, clearFilters, expectAssets } from '../ui.ts'

// Given: A library containing several categories and an uncategorized asset.
// When: Include, combine, exclude, and clear category filters.
// Then: Only matching assets remain and clearing filters restores the list.
test(
  'Filter assets by included, excluded, and missing categories',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, { initialData: library })
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await chooseFilter(browser, 'カテゴリ', '衣装')
    await expectAssets(browser, ['Blouse', 'Coat'])
    await chooseFilter(browser, 'カテゴリ', '家具')
    await expectAssets(browser, ['Blouse', 'Coat', 'Desk'])
    await clearFilters(browser)
    await chooseFilter(browser, 'カテゴリ', '-衣装')
    await expectAssets(browser, ['Desk'])
    await clearFilters(browser)
    await browser
      .$('[role="group"][aria-label="カテゴリ"] [role="button"]')
      .click() // カテゴリは OR → 未指定
    await expectAssets(browser, ['Effect'])
    await clearFilters(browser)
  },
)
