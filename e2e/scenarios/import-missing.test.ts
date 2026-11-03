import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { pickers } from '../fixtures.ts'
import { addManually, button, closeDialog, waitForUi } from '../ui.ts'

// Given: A picker response containing one existing and one missing file.
// When: Inspect the import warning and continue.
// Then: Only the existing file is imported and displayed in the library.
test(
  'Warn about missing files and import only the files that exist',
  { timeout: 90_000 },
  async (t) => {
    const { browser, root } = await startApp(t, {
      initialData: async (root) => {
        await mkdir(path.join(root, 'input'))
        await writeFile(path.join(root, 'input/exists.txt'), 'survivor')
        await pickers(root, [
          {
            kind: 'open',
            multiple: true,
            response: ['exists.txt', 'missing.txt'].map((name) =>
              path.join(root, 'input', name),
            ),
          },
        ])
      },
    })
    await addManually(browser, 'その他', 'Partial import')
    await browser.$(button('アセットを追加', '//*[@role="dialog"]')).click()
    await browser.$('h2*=追加するファイル/フォルダの確認').waitForDisplayed()
    await browser.$('li*=exists.txt').waitForDisplayed()
    await browser.$('li*=missing.txt').waitForDisplayed()
    await waitForUi(
      browser,
      async () =>
        await browser
          .$(
            '//*[@role="dialog"]//div[normalize-space(.)="インポートされるアイテム (1)"]/following-sibling::ul/li',
          )
          .getText(),
      path.join(root, 'input/exists.txt'),
    )
    await waitForUi(
      browser,
      async () =>
        await browser
          .$(
            '//*[@role="dialog"]//div[normalize-space(.)="存在しないためスキップされるアイテム (1)"]/following-sibling::ul/li',
          )
          .getText(),
      path.join(root, 'input/missing.txt'),
    )
    await waitForUi(
      browser,
      async () => await browser.$(button('続行する')).isEnabled(),
      true,
    )
    await closeDialog(browser, () => browser.$(button('続行する')).click())
    await browser.waitUntil(
      async () =>
        (await browser.$('main').getText()).includes('Partial import'),
      { timeoutMsg: '残存ファイルのアセットが表示されませんでした' },
    )
    const saved = JSON.parse(
      await readFile(
        path.join(root, 'assets/metadata/otherAssets.json'),
        'utf8',
      ),
    ).data
    assert.equal(saved.length, 1)
    assert.equal(
      await readFile(
        path.join(root, 'assets/data', saved[0].id, 'exists.txt'),
        'utf8',
      ),
      'survivor',
    )
  },
)
