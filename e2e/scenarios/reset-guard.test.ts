import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import {
  button,
  expectAssets,
  openSettings,
  closeDialog,
  waitForUi,
} from '../ui.ts'

// Given: A library containing registered assets and files.
// When: Select reset targets, confirm, change the selection, and cancel.
// Then: Confirmation is cleared and cancellation leaves the library intact.
test(
  'Reset deletion confirmation when the selection changes and preserve data on cancellation',
  { timeout: 90_000 },
  async (t) => {
    const { browser, root } = await startApp(t, { initialData: library })
    await openSettings(browser)
    await browser.$(button('初期化する')).click()
    await browser.$('[role="alertdialog"]').waitForDisplayed()
    await waitForUi(
      browser,
      async () =>
        (await browser.$$('[role="alertdialog"] [role="checkbox"]')).length,
      4,
    )
    const confirm =
      '//*[@role="alertdialog"]//div[normalize-space(.)="私は削除後のデータが元に戻せないことを理解しています"]/preceding-sibling::*[@role="checkbox"]'
    const metadata =
      '//*[@role="alertdialog"]//div[span[contains(.,"アセット情報")]]/preceding-sibling::*[@role="checkbox"]'
    const remove = button('削除する', '//*[@role="alertdialog"]')
    await waitForUi(
      browser,
      async () => await browser.$(remove).isEnabled(),
      false,
    )
    await browser.$(metadata).click()
    await browser.$(confirm).click()
    await browser.$(remove).waitForEnabled()
    await browser.$(metadata).click()
    await browser.waitUntil(
      async () =>
        (await browser.$(confirm).getAttribute('aria-checked')) === 'false' &&
        !(await browser.$(remove).isEnabled()),
      { timeoutMsg: '削除対象の変更で確認が解除されませんでした' },
    )
    await closeDialog(
      browser,
      () => browser.$(button('キャンセル', '//*[@role="alertdialog"]')).click(),
      '[role="alertdialog"]',
    )
    await browser.$(button('トップ画面に戻る')).click()
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    assert.equal(
      await readFile(
        path.join(root, 'assets/data', assets[0].id, 'Aster.txt'),
        'utf8',
      ),
      'Aster content',
    )
  },
)
