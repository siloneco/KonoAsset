import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { card, clearFilters, expectAssets, waitForUi } from '../ui.ts'

// Given: A library with overlapping names and a shop containing an exclusion-like word.
// When: Use normal and advanced searches, click the shop, and apply exclusions.
// Then: Exact shop names remain searchable, other conditions apply, and clearing restores the library.
test(
  'Search asset names and shops and recover from an empty result',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const file = path.join(root, 'assets/metadata/avatarWearables.json')
        const metadata = JSON.parse(await readFile(file, 'utf8'))
        for (const asset of metadata.data)
          asset.description.creator = 'Maple -b'
        await writeFile(file, JSON.stringify(metadata))
      },
    })
    const shop = 'input[placeholder="ショップ名を入力..."]'
    const name = 'input[placeholder="アセット名を入力..."]'
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
    await browser.$(card('Coat')).$('p=Maple -b').click()
    await waitForUi(
      browser,
      async () => await browser.$(shop).getValue(),
      'Maple -b',
    )
    await expectAssets(browser, ['Blouse', 'Coat'])
    await browser.$(name).setValue('Coat')
    await expectAssets(browser, ['Coat'])
    await browser.$(name).setValue('-Coat')
    await expectAssets(browser, ['Blouse'])
    await browser.$(shop).setValue('Maple')
    await expectAssets(browser, ['Blouse'])
    await clearFilters(browser)
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])

    await browser.$('div=詳細').click()
    await browser.$(shop).setValue('Maple -b')
    await expectAssets(browser, ['Blouse', 'Coat'])
    await browser.$(shop).setValue('a -Zebra')
    await expectAssets(browser, ['Blouse', 'Coat', 'Desk', 'Effect'])
    await browser.$(shop).setValue('-b')
    await expectAssets(browser, ['Desk'])
    await clearFilters(browser)
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
  },
)
