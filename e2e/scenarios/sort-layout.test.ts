import assert from 'node:assert/strict'
import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { button, card, expectAssets } from '../ui.ts'

test(
  '表示サイズを選んで一覧を読み、追加日・名前・ショップ・公開日で並べ替えられる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { initialData: library })
    const { browser } = app
    await expectAssets(browser, ['Aster', 'Blouse', 'Coat', 'Desk', 'Effect'])
    await browser.$('[data-testid="status-bar-option-popover-trigger"]').click()
    let previousWidth = 0
    for (const size of ['大', '中', '小', 'リスト']) {
      await browser.$(button(size)).click()
      await browser.waitUntil(
        async () => {
          const width = await browser.$(card('Aster')).getSize('width')
          return (
            width > 0 &&
            width !== previousWidth &&
            (await browser.$(button(size)).getAttribute('aria-pressed')) ===
              'true'
          )
        },
        { timeoutMsg: `${size} に表示サイズが変わりませんでした` },
      )
      previousWidth = await browser.$(card('Aster')).getSize('width')
      assert.ok(previousWidth > 0)
    }
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
    await next.$('[data-testid="status-bar-option-popover-trigger"]').click()
    assert.equal(
      await next.$(button('リスト')).getAttribute('aria-pressed'),
      'true',
    )
  },
)
