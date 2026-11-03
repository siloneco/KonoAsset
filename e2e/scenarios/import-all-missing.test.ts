import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { pickers } from '../fixtures.ts'
import { addManually, button, closeDialog, waitForUi } from '../ui.ts'

// Given: A picker response containing only a nonexistent local file.
// When: Submit the asset, inspect the warning, return, and cancel.
// Then: Import cannot continue and the library remains empty.
test(
  'Prevent importing missing files and allow returning to cancel',
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
    await waitForUi(
      browser,
      async () => await browser.$(button('続行する')).isEnabled(),
      false,
    )
    await browser.$('[role="dialog"] [data-slot="tooltip-trigger"]').moveTo()
    await browser.$('[role="tooltip"]').waitForDisplayed()
    await waitForUi(
      browser,
      async () => await browser.$('[role="tooltip"]').getText(),
      'インポートできるアイテムが無いため、続行できません',
    )
    await browser.$('li*=missing.txt').waitForDisplayed()
    await browser.$(button('戻る', '//*[@role="dialog"]')).click()
    await browser.$('textarea').waitForDisplayed()
    await closeDialog(browser, () => browser.keys('Escape'))
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
  },
)
