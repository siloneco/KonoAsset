import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { library, pickers } from '../fixtures.ts'
import { unzip } from '../archive.ts'
import { button, openSettings } from '../ui.ts'

test(
  'エクスプローラー用ZIPをタイプ・カテゴリ・名前の階層で書き出せる',
  { timeout: 90_000 },
  async (t) => {
    const { browser, root } = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        await pickers(root, [
          { kind: 'save', response: null },
          { kind: 'save', response: path.join(root, 'readable.zip') },
        ])
      },
    })
    await openSettings(browser, 'データの移行')
    await browser.$('div=エクスプローラー等で表示するため').click()
    await browser.$(button('選択')).click()
    assert.equal(await browser.$(button('出力する')).isEnabled(), false)
    await browser.$(button('選択')).click()
    await browser.$(button('出力する')).waitForEnabled()
    await browser.$(button('出力する')).click()
    await browser.$('div=エクスポートが完了しました！').waitForDisplayed()
    const exported = unzip(await readFile(path.join(root, 'readable.zip')))
    for (const [name, content] of [
      ['Avatars/Aster/Aster.txt', 'Aster content'],
      ['AvatarWearables/衣装/Blouse/Blouse.txt', 'Blouse content'],
      ['AvatarWearables/衣装/Coat/Coat.txt', 'Coat content'],
      ['WorldObjects/家具/Desk/Desk.txt', 'Desk content'],
      ['OtherAssets/Uncategorized/Effect/Effect.txt', 'Effect content'],
    ])
      assert.equal(exported.get(name)?.toString(), content, name)
  },
)
