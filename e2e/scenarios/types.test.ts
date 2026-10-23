import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { card, clearFilters, expectAssets } from '../ui.ts'

test(
  'タイプとカードのショップ・タイプから目的のアセットを絞り込める',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, { initialData: library })
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    for (const [type, names] of [
      ['Avatar', ['Aster']],
      ['AvatarWearable', ['Blouse', 'Coat']],
      ['WorldObject', ['Desk']],
      ['OtherAsset', ['Effect']],
      ['All', ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect']],
    ] as const) {
      await browser.$(`[role="radio"][value="${type}"]`).click()
      await expectAssets(browser, [...names])
    }
    await browser.$(card('Coat')).$('p=Maple-B').click()
    await expectAssets(browser, ['Coat'])
    await clearFilters(browser)
    await browser.$(card('Desk')).$('span=ワールドアセット').click()
    await expectAssets(browser, ['Desk'])
    await clearFilters(browser)
  },
)
