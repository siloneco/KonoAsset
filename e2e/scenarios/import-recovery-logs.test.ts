import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { library, pickers } from '../fixtures.ts'
import { button, openSettings } from '../ui.ts'

test(
  '誤った移行元のエラーをログ更新で確認し、正しいフォルダから取り込み直せる',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        await library(path.join(root, 'external'))
        await pickers(root, [
          {
            kind: 'open',
            directory: true,
            multiple: false,
            response: path.join(root, 'assets'),
          },
          {
            kind: 'open',
            directory: true,
            multiple: false,
            response: path.join(root, 'external/assets'),
          },
        ])
      },
    })
    await openSettings(browser, 'データの移行')
    await browser.$(button('フォルダからインポート')).click()
    await browser.$('div=インポートに失敗しました').waitForDisplayed()
    await browser.$(button('ログの確認')).click()
    const error = 'p*=Cannot import assets from the same data store'
    assert.equal(await browser.$(error).isExisting(), false)
    await browser.$('button[aria-label="更新"]').click()
    await browser.$(error).waitForDisplayed()
    await browser.$('p*=logging to file').waitForExist()
    await browser.$(button('データの移行')).click()
    await browser.$(button('フォルダからインポート')).click()
    await browser.$('div=インポートが完了しました！').waitForDisplayed()
    await browser.$(button('トップ画面に戻る')).click()
    await browser.waitUntil(
      async () =>
        (await browser.$('main').getText()).includes('10個のアセットのうち'),
      {
        timeoutMsg:
          'エラーから復帰してフォルダの取り込みを完了できませんでした',
      },
    )
  },
)
