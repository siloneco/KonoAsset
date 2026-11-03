import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { waitForSetup, waitForUi } from '../ui.ts'

// Given: A fresh app without an existing preference file.
// When: Complete setup without changing the defaults and restart.
// Then: Default preferences are saved and the library opens directly on restart.
test(
  'Complete first-run setup with defaults and skip setup after restart',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { setup: true })
    const { browser } = app
    // The default language follows the OS; all bundled languages are accepted here.
    const next =
      '//*[@role="tabpanel" and @data-state="active"]//button[normalize-space(.)="次へ" or normalize-space(.)="Next" or normalize-space(.)="下一步"]'
    await waitForSetup(browser)
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
    await waitForUi(browser, async () => browser.$('main').isDisplayed(), true)
    const saved = await app.readPreference()
    assert.equal(saved.dataDirPath, path.join(app.root, 'assets'))
    assert.equal(saved.zipExtraction, true)
    assert.equal(saved.deleteOnImport, false)
    const restarted = await app.restart()
    await waitForUi(
      restarted,
      async () => restarted.$('main').isDisplayed(),
      true,
    )
    await waitForUi(
      restarted,
      async () => new URL(await restarted.getUrl()).pathname,
      '/',
    )
  },
)
