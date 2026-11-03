import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { chooseFilter, clearFilters, expectAssets } from '../ui.ts'

// Given: A library with overlapping tags and other filter values.
// When: Include, combine, exclude, and clear tags, then combine the other filters.
// Then: Only assets matching the selected filters are displayed.
test(
  'Combine tag filters with asset type, category, avatar, and search filters',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, { initialData: library })
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await chooseFilter(browser, 'タグ', '赤')
    await expectAssets(browser, ['Aster', 'Blouse'])
    await chooseFilter(browser, 'タグ', '青')
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat'])
    await browser.$('[role="group"][aria-label="タグ"] [role="button"]').click()
    await expectAssets(browser, ['Blouse'])
    await clearFilters(browser)
    await chooseFilter(browser, 'タグ', '-赤')
    await expectAssets(browser, ['Coat', 'Desk', 'Effect'])
    await clearFilters(browser)
    await browser.$('[role="group"][aria-label="タグ"] [role="button"]').click()
    await browser.$('[role="group"][aria-label="タグ"] [role="button"]').click()
    await expectAssets(browser, ['Effect'])
    await clearFilters(browser)
    await browser.$('[role="radio"][value="AvatarWearable"]').click()
    await chooseFilter(browser, 'タグ', '青')
    await chooseFilter(browser, 'カテゴリ', '衣装')
    await chooseFilter(browser, '対応アバター', 'Aster')
    await browser.$('input[placeholder="キーワードを入力..."]').setValue('Coat')
    await expectAssets(browser, ['Coat'])
  },
)
