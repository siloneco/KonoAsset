import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { startApp } from '../app.ts'
import { button, openSettings } from '../ui.ts'

test(
  '設定の各ページを開いてバージョンと関連リンクを確認し、トップに戻れる',
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
      assert.equal(
        await browser.$(`a[href="${href}"]`).getAttribute('target'),
        '_blank',
      )
    }
    await browser.$(button('一般設定')).click()
    await browser.$('#preference-theme').waitForDisplayed()
    await browser.$(button('トップ画面に戻る')).click()
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
    assert.equal(new URL(await browser.getUrl()).pathname, '/')
  },
)
