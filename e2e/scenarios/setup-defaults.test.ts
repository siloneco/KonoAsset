import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'

test(
  '初回設定を変更せずに完了しても設定ファイルが作られ、次回は通常起動する',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { setup: true })
    const { browser } = app
    // The default language follows the OS; all bundled languages are accepted here.
    const next =
      '//*[@role="tabpanel" and @data-state="active"]//button[normalize-space(.)="次へ" or normalize-space(.)="Next" or normalize-space(.)="下一步"]'
    await browser.$(next).click()
    await browser.$('[data-slot="tabs"][aria-busy="false"]').waitForDisplayed()
    await browser
      .$('[role="tabpanel"][data-state="active"] input')
      .waitForDisplayed()
    await browser.$(next).click()
    await browser.$('[data-slot="tabs"][aria-busy="false"]').waitForDisplayed()
    await browser
      .$(
        '//*[@role="tabpanel" and @data-state="active"]//button[normalize-space(.)="利用をはじめる！" or normalize-space(.)="Get Started!" or normalize-space(.)="开始使用！"]',
      )
      .click()
    await browser.$('main').waitForDisplayed()
    const saved = await app.readPreference()
    assert.equal(saved.dataDirPath, path.join(app.root, 'assets'))
    assert.equal(saved.zipExtraction, true)
    assert.equal(saved.deleteOnImport, false)
    const restarted = await app.restart()
    await restarted.$('main').waitForDisplayed()
    assert.equal(new URL(await restarted.getUrl()).pathname, '/')
  },
)
