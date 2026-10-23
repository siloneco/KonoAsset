import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { clearFilters, expectAssets } from '../ui.ts'

test(
  '名前とショップを通常・詳細・除外検索し、該当なしから復帰できる',
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
