import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { button, expectAssets, manualEdit, openSettings } from '../ui.ts'

test(
  '旧形式の設定と全タイプのアセットを読み込み、編集して現行形式で保存できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const prefPath = path.join(root, 'app/preference.json')
        const pref = JSON.parse(await readFile(prefPath, 'utf8'))
        pref.version = 5
        pref.data.theme = 'dark'
        delete pref.data.useTrashBin
        await writeFile(prefPath, JSON.stringify(pref))
        for (const type of ['avatars', 'avatarWearables', 'worldObjects']) {
          const file = path.join(root, 'assets/metadata', `${type}.json`)
          const metadata = JSON.parse(await readFile(file, 'utf8'))
          metadata.version = 2
          for (const a of metadata.data) delete a.description.dependencies
          await writeFile(file, JSON.stringify(metadata))
        }
      },
    })
    await expectAssets(
      app.browser,
      assets.map((a) => a.name),
    )
    await openSettings(app.browser)
    assert.equal(await app.browser.$('#preference-theme').getText(), 'ダーク')
    await app.browser.$('#preference-theme').click()
    await app.browser
      .$('//*[@role="option" and normalize-space(.)="ライト"]')
      .click()
    await app.browser.waitUntil(
      async () => (await app.readPreference()).theme === 'light',
      { timeoutMsg: '移行した設定を保存できませんでした' },
    )
    await app.browser.$(button('トップ画面に戻る')).click()
    await manualEdit(app.browser, 'Coat')
    await app.browser.$(button('次へ', '//*[@role="dialog"]')).click()
    assert.equal(await app.browser.$('textarea').getValue(), 'Coat のメモ')
    await app.browser.$(button('アセットを更新', '//*[@role="dialog"]')).click()
    await app.browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    const updated = JSON.parse(
      await readFile(
        path.join(app.root, 'assets/metadata/avatarWearables.json'),
        'utf8',
      ),
    )
    assert.equal(updated.version, 3)
    assert.equal(
      JSON.parse(
        await readFile(path.join(app.root, 'app/preference.json'), 'utf8'),
      ).version,
      6,
    )
    await expectAssets(
      await app.restart(),
      assets.map((a) => a.name),
    )
  },
)
