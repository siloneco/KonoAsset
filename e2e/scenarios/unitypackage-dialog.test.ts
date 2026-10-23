import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { button, card, expectAssets, openSettings } from '../ui.ts'

test(
  '複数のUnitypackageを一覧で確認して閉じ、次回の開き方の設定を保存できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const folder = path.join(root, 'assets/data', assets[2].id)
        await mkdir(path.join(folder, 'nested'))
        for (const file of ['one.unitypackage', 'nested/two.unitypackage'])
          await writeFile(path.join(folder, file), 'fixture package')
      },
    })
    const { browser } = app
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    await browser.$(card('Coat')).$('button=開く').click()
    await browser.$('h2=どのファイルを利用しますか？').waitForDisplayed()
    await browser.$('p=one.unitypackage').waitForDisplayed()
    await browser.$('p=two.unitypackage').waitForDisplayed()
    await browser.$('span=nested/').waitForDisplayed()
    await browser.$(button('閉じる', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.$(card('Coat')).$('button=開く').click()
    await browser.$('h2=どのファイルを利用しますか？').waitForDisplayed()
    await browser.$('[role="dialog"] [role="checkbox"]').click()
    await browser.waitUntil(
      async () => !(await app.readPreference()).useUnitypackageSelectedOpen,
      { timeoutMsg: '次回は管理フォルダを開く設定が保存されませんでした' },
    )
    await browser.$(button('閉じる', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    const next = await app.restart()
    await openSettings(next)
    assert.equal(
      await next
        .$('[role="switch"][aria-label="Unitypackageを優先して開く"]')
        .getAttribute('aria-checked'),
      'false',
    )
    assert.equal(
      await readFile(
        path.join(app.root, 'assets/data', assets[2].id, 'one.unitypackage'),
        'utf8',
      ),
      'fixture package',
    )
  },
)
