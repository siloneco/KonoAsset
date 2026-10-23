import assert from 'node:assert/strict'
import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { assetMenu, button, card, expectAssets, manualEdit } from '../ui.ts'

test(
  '削除を取り消して保持し、再確認後は対象だけを削除できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const file = path.join(root, 'assets/metadata/avatarWearables.json')
        const metadata = JSON.parse(await readFile(file, 'utf8'))
        metadata.data.find(
          (a: { id: string }) => a.id === assets[1].id,
        ).description.dependencies = [assets[2].id]
        await writeFile(file, JSON.stringify(metadata))
      },
      preference: { useTrashBin: false },
    })
    const { browser, root } = app
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    await assetMenu(browser, 'Coat', '削除')
    await browser.$('[role="alertdialog"]').waitForDisplayed()
    await browser.$(button('キャンセル', '//*[@role="alertdialog"]')).click()
    await browser.$('[role="alertdialog"]').waitForDisplayed({ reverse: true })
    await browser.keys('Escape')
    await browser.$('[role="menu"]').waitForExist({ reverse: true })
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    await access(path.join(root, 'assets/data', assets[2].id, 'Coat.txt'))
    await assetMenu(browser, 'Coat', '削除')
    await browser.$(button('削除', '//*[@role="alertdialog"]')).click()
    await browser.$('[role="alertdialog"]').waitForDisplayed({ reverse: true })
    await expectAssets(browser, ['Aster', 'Blouse', 'Desk', 'Effect'])
    await manualEdit(browser, 'Blouse')
    await browser.$(button('次へ', '//*[@role="dialog"]')).click()
    await browser.$('p=選択されていません').waitForDisplayed()
    await browser.keys('Escape')
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.$('input[placeholder="キーワードを入力..."]').setValue('Coat')
    await expectAssets(browser, [])
    assert.equal(await browser.$(card('Coat')).isExisting(), false)
    const metadata = JSON.parse(
      await readFile(
        path.join(root, 'assets/metadata/avatarWearables.json'),
        'utf8',
      ),
    )
    assert.deepEqual(
      metadata.data.map((a: { id: string }) => a.id),
      [assets[1].id],
    )
    assert.deepEqual(metadata.data[0].description.dependencies, [])
    await assert.rejects(access(path.join(root, 'assets/data', assets[2].id)), {
      code: 'ENOENT',
    })
    const next = await app.restart()
    await expectAssets(next, ['Aster', 'Blouse', 'Desk', 'Effect'])
  },
)
