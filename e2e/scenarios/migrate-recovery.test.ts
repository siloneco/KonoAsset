import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library, pickers } from '../fixtures.ts'
import { button, openSettings } from '../ui.ts'

test(
  '保存先移行の失敗後にやり直し、移行せず空の保存先へ切り替えて元データを残せる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        await mkdir(path.join(root, 'occupied'))
        await writeFile(
          path.join(root, 'occupied/keep.txt'),
          'do not overwrite',
        )
        await mkdir(path.join(root, 'empty'))
        await pickers(root, [
          {
            kind: 'open',
            directory: true,
            multiple: false,
            response: path.join(root, 'occupied'),
          },
          {
            kind: 'open',
            directory: true,
            multiple: false,
            response: path.join(root, 'empty'),
          },
        ])
      },
    })
    const { browser, root } = app
    await openSettings(browser)
    await browser.$(button('変更する')).click()
    await browser.$(button('選択', '//*[@role="dialog"]')).click()
    await browser.$(button('移行', '//*[@role="dialog"]')).click()
    await browser.$('div=データフォルダの移行に失敗しました').waitForDisplayed()
    assert.equal(
      (await app.readPreference()).dataDirPath,
      path.join(root, 'assets'),
    )
    await browser.$(button('選択', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"] [role="checkbox"]').click()
    await browser
      .$('p=十分に理解している場合のみ行ってください')
      .waitForDisplayed()
    await browser.$(button('変更', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.waitUntil(
      async () =>
        (await app.readPreference()).dataDirPath === path.join(root, 'empty'),
      { timeoutMsg: '移行せず保存先を変更できませんでした' },
    )
    await browser.$(button('トップ画面に戻る')).click()
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
    assert.equal(
      await readFile(
        path.join(root, 'assets/data', assets[2].id, 'Coat.txt'),
        'utf8',
      ),
      'Coat content',
    )
    assert.equal(
      await readFile(path.join(root, 'occupied/keep.txt'), 'utf8'),
      'do not overwrite',
    )
    const next = await app.restart()
    await next.$('p=アセットが1つも登録されていません').waitForDisplayed()
  },
)
