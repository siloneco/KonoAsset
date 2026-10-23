import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library, pickers } from '../fixtures.ts'
import { button, expectAssets, openSettings } from '../ui.ts'

test(
  '保存先変更を中止でき、データを移行した後も再起動してアセットを利用できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        await mkdir(path.join(root, 'moved'))
        await pickers(root, [
          {
            kind: 'open',
            directory: true,
            multiple: false,
            response: path.join(root, 'moved'),
          },
        ])
      },
    })
    const { browser, root } = app
    await openSettings(browser)
    await browser.$(button('変更する')).click()
    await browser.$('[role="dialog"] input[value$="assets"]').waitForDisplayed()
    assert.equal(
      await browser.$('[role="dialog"] input[value$="assets"]').getValue(),
      path.join(root, 'assets'),
    )
    await browser.$('[role="dialog"] [role="checkbox"]').click()
    await browser
      .$('p=十分に理解している場合のみ行ってください')
      .waitForDisplayed()
    await browser.$(button('キャンセル', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    assert.equal(
      (await app.readPreference()).dataDirPath,
      path.join(root, 'assets'),
    )
    await browser.$(button('変更する')).click()
    await browser.$(button('選択', '//*[@role="dialog"]')).click()
    await browser.$(button('移行', '//*[@role="dialog"]')).waitForEnabled()
    await browser.$(button('移行', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.waitUntil(
      async () =>
        (await app.readPreference()).dataDirPath === path.join(root, 'moved'),
      { timeoutMsg: '新しい保存先が保存されませんでした' },
    )
    await browser.$(button('トップ画面に戻る')).click()
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    assert.equal(
      await readFile(
        path.join(root, 'moved/data', assets[2].id, 'Coat.txt'),
        'utf8',
      ),
      'Coat content',
    )
    await expectAssets(
      await app.restart(),
      assets.map((a) => a.name),
    )
  },
)
