import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { chooseFilter, clearFilters, expectAssets } from '../ui.ts'

test(
  'タグをOR・AND・除外・未指定で探し、タイプや検索と組み合わせられる',
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
