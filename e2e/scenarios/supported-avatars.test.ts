import test from 'node:test'
import { startApp } from '../app.ts'
import { libraryWithUnlabeledWearable } from '../fixtures.ts'
import { chooseFilter, clearFilters, expectAssets } from '../ui.ts'

// Given: A library containing wearables with overlapping and missing supported avatars.
// When: Combine avatar filters, change matching mode, and clear the filters.
// Then: Only matching wearables are displayed.
test(
  'Filter wearables by included, combined, excluded, and missing avatars',
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
