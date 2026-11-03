import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { library, pickers } from '../fixtures.ts'
import { button, openSettings, waitForUi } from '../ui.ts'

// Given: The current library and a separate valid library.
// When: Try importing the current store, refresh logs, then import the separate store.
// Then: The error is visible in the refreshed logs and the retry adds the imported assets.
test(
  'Inspect a failed import in the logs and recover by importing a valid library',
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
    await browser.$('p*=logging to file').waitForExist()
    const error = 'p*=Cannot import assets from the same data store'
    await waitForUi(
      browser,
      async () => await browser.$(error).isExisting(),
      false,
    )
    await browser.$('button[aria-label="更新"]').click()
    await browser.$(error).waitForDisplayed()
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
