import assert from 'node:assert/strict'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library, pickers } from '../fixtures.ts'
import { assetMenu, button, expectAssets } from '../ui.ts'

test(
  '管理データにファイルとフォルダを追加し、対象だけ削除して最新一覧を確認できる',
  { timeout: 90_000 },
  async (t) => {
    const { browser, root } = await startApp(t, {
      preference: { useTrashBin: false },
      initialData: async (root) => {
        await library(root)
        await mkdir(path.join(root, 'input/extra'), { recursive: true })
        await writeFile(path.join(root, 'input/extra/nested.txt'), 'nested')
        await writeFile(path.join(root, 'input/additional.txt'), 'additional')
        await pickers(root, [
          {
            kind: 'open',
            directory: false,
            multiple: true,
            response: [path.join(root, 'input/additional.txt')],
          },
          {
            kind: 'open',
            directory: true,
            multiple: true,
            response: [path.join(root, 'input/extra')],
          },
        ])
      },
    })
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    await assetMenu(browser, 'Coat', 'データ管理')
    await browser
      .$('[role="dialog"] [role="group"][aria-label="Coat.txt"]')
      .waitForDisplayed()
    await browser
      .$('[role="dialog"] button[aria-label="ファイルを選択する"]')
      .click()
    await browser
      .$(
        '[role="status"][aria-label="additional.txt"][data-status="Completed"]',
      )
      .waitForDisplayed()
    await browser.$('[role="dialog"] button[aria-label="更新"]').click()
    await browser
      .$('[role="dialog"] [role="group"][aria-label="additional.txt"]')
      .waitForDisplayed()
    await browser
      .$('[role="dialog"] button[aria-label="フォルダを選択する"]')
      .click()
    await browser
      .$('[role="status"][aria-label="extra"][data-status="Completed"]')
      .waitForDisplayed()
    await browser.$('[role="dialog"] button[aria-label="更新"]').click()
    await browser
      .$('[role="dialog"] [role="group"][aria-label="extra/"]')
      .waitForDisplayed()
    const row = '[role="dialog"] [role="group"][aria-label="additional.txt"]'
    await browser.$(`${row} button[aria-label="削除"]`).click()
    await browser.$(button('削除', '//*[@data-slot="popover-content"]')).click()
    await browser.waitUntil(
      async () =>
        (await browser.$(row).getAttribute('data-deleted')) === 'true',
      { timeoutMsg: '管理ファイルの削除が完了しませんでした' },
    )
    await browser.$('[role="dialog"] button[aria-label="更新"]').click()
    await browser.$(row).waitForExist({ reverse: true })
    await browser
      .$('[role="dialog"] [role="group"][aria-label="extra/"]')
      .waitForDisplayed()
    await browser.$(button('完了', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await assetMenu(browser, 'Coat', 'データ管理')
    await browser
      .$('[role="dialog"] [role="group"][aria-label="Coat.txt"]')
      .waitForDisplayed()
    assert.equal(await browser.$(row).isExisting(), false)
    const data = path.join(root, 'assets/data', assets[2].id)
    await assert.rejects(access(path.join(data, 'additional.txt')), {
      code: 'ENOENT',
    })
    assert.equal(
      await readFile(path.join(data, 'extra/nested.txt'), 'utf8'),
      'nested',
    )
    assert.equal(
      await readFile(path.join(data, 'Coat.txt'), 'utf8'),
      'Coat content',
    )
  },
)
