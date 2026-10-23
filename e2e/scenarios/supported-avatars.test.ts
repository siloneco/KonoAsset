import test from 'node:test'
import { startApp } from '../app.ts'
import { libraryWithUnlabeledWearable } from '../fixtures.ts'
import { chooseFilter, clearFilters, expectAssets } from '../ui.ts'

test(
  '対応アバターをOR・AND・除外・未指定で絞り込める',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: libraryWithUnlabeledWearable,
    })
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await chooseFilter(browser, '対応アバター', 'Aster')
    await expectAssets(browser, ['Blouse', 'Coat'])
    await chooseFilter(browser, '対応アバター', 'Birch')
    await expectAssets(browser, ['Blouse', 'Coat'])
    await browser
      .$('[role="group"][aria-label="対応アバター"] [role="button"]')
      .click()
    await expectAssets(browser, ['Blouse'])
    await clearFilters(browser)
    await chooseFilter(browser, '対応アバター', '-Aster')
    await expectAssets(browser, ['Effect'])
    await clearFilters(browser)
    await browser
      .$('[role="group"][aria-label="対応アバター"] [role="button"]')
      .click()
    await browser
      .$('[role="group"][aria-label="対応アバター"] [role="button"]')
      .click()
    await expectAssets(browser, ['Effect'])
  },
)
