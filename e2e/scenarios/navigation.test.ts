import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { startApp } from '../app.ts'
import { button, openSettings, waitForUi } from '../ui.ts'

// Given: An app with no registered assets.
// When: Visit settings pages and inspect the About page without following external links.
// Then: The expected controls, version, and links are shown and the home page is reachable.
test(
  'Navigate the settings pages and return to the library',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t)
    const { version } = JSON.parse(
      await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
    )
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
    await openSettings(browser, 'データの移行')
    await browser.$(button('ZIPファイルからインポート')).waitForDisplayed()
    await browser.$(button('統計')).click()
    await browser
      .$('[role="group"][aria-label="アセット登録数"]')
      .waitForDisplayed()
    await browser.$(button('ログの確認')).click()
    await browser.$(button('フォルダを開く')).waitForDisplayed()
    await browser.$(button('このアプリについて')).click()
    await browser.waitUntil(
      async () => (await browser.$('h1').getText()).includes(`v${version}`),
      { timeoutMsg: 'アプリのバージョンが正しく表示されませんでした' },
    )
    for (const href of [
      'https://go.konoasset.dev/github',
      'https://go.konoasset.dev/discord',
      'https://github.com/siloneco/KonoAsset/blob/develop/CHANGELOG.md',
      'https://github.com/siloneco',
      'https://github.com/Raifa21',
      'https://github.com/puk06',
      'https://x.com/siloneco_vrc',
      'https://x.com/raifa_trtr',
      'https://x.com/Jan_kumaVRC',
      'https://x.com/pukorufu',
    ]) {
      await waitForUi(
        browser,
        async () => await browser.$(`a[href="${href}"]`).getAttribute('target'),
        '_blank',
      )
    }
    await browser.$(button('一般設定')).click()
    await browser.$('#preference-theme').waitForDisplayed()
    await browser.$(button('トップ画面に戻る')).click()
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
    await waitForUi(
      browser,
      async () => new URL(await browser.getUrl()).pathname,
      '/',
    )
  },
)
