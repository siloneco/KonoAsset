import test from 'node:test'
import { startApp } from '../app.ts'
import { button, openSettings, closeDialog } from '../ui.ts'

// Given: An empty library.
// When: Open statistics, return home, and cancel adding an asset.
// Then: Statistics show zero and the library remains empty.
test(
  'View empty statistics and return to adding the first asset',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t)
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
    await openSettings(browser, '統計')
    for (const label of [
      'アセット登録数',
      'アバター素体',
      'アバター関連アセット',
      'ワールドアセット',
      'その他',
    ]) {
      await browser.waitUntil(
        async () =>
          (
            await browser
              .$(
                `[role="group"][aria-label="${label}"] [data-slot="card-content"]`,
              )
              .getText()
          ).startsWith('0'),
        { timeoutMsg: `未登録の ${label} が0になりませんでした` },
      )
    }
    await browser.waitUntil(
      async () =>
        (await browser
          .$('[data-testid="asset-disk-usage"]')
          .getAttribute('aria-busy')) === 'false',
      { timeoutMsg: '未登録時の容量集計が完了しませんでした' },
    )
    await browser.waitUntil(
      async () =>
        (await browser.$('[data-testid="asset-type-chart"] svg').getText())
          .replace(/\s+/g, '')
          .includes('0アセット'),
      { timeoutMsg: '未登録でもタイプ別グラフの合計0が表示されませんでした' },
    )
    await browser.$(button('トップ画面に戻る')).click()
    await browser.$(button('アセットを追加する')).click()
    await browser.$(button('ファイルを選択する')).waitForDisplayed()
    await closeDialog(browser, () =>
      browser.$(button('キャンセル', '//*[@role="dialog"]')).click(),
    )
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
  },
)
