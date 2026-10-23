import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { pickers } from '../fixtures.ts'
import { addManually, button } from '../ui.ts'

test(
  '追加対象がすべて無いときは続行できず、戻って中止できる',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: async (root) => {
        await pickers(root, [
          {
            kind: 'open',
            multiple: true,
            response: [path.join(root, 'missing.txt')],
          },
        ])
      },
    })
    await addManually(browser, 'その他', 'Missing import')
    await browser.$(button('アセットを追加', '//*[@role="dialog"]')).click()
    await browser.$('h2*=追加するファイル/フォルダの確認').waitForDisplayed()
    assert.equal(await browser.$(button('続行する')).isEnabled(), false)
    await browser.$('[role="dialog"] [data-slot="tooltip-trigger"]').moveTo()
    await browser.$('[role="tooltip"]').waitForDisplayed()
    assert.equal(
      await browser.$('[role="tooltip"]').getText(),
      'インポートできるアイテムが無いため、続行できません',
    )
    await browser.$('li*=missing.txt').waitForDisplayed()
    await browser.$(button('戻る', '//*[@role="dialog"]')).click()
    await browser.$('textarea').waitForDisplayed()
    await browser.keys('Escape')
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
  },
)
