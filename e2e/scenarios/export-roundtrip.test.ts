import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library, pickers } from '../fixtures.ts'
import { unzip } from '../archive.ts'
import { button, openSettings } from '../ui.ts'

test(
  'KonoAsset形式で書き出して再インポートし、ID重複があってもデータを保持できる',
  { timeout: 90_000 },
  async (t) => {
    const { browser, root } = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const zip = path.join(root, 'backup.zip')
        await pickers(root, [
          { kind: 'save', response: zip },
          { kind: 'open', multiple: false, directory: false, response: zip },
        ])
      },
    })
    await openSettings(browser, 'データの移行')
    await browser.$('div=他デバイスのKonoAssetへ移行するため').click()
    assert.equal(await browser.$(button('出力する')).isEnabled(), false)
    await browser.$(button('選択')).click()
    await browser.$(button('出力する')).waitForEnabled()
    await browser.$(button('出力する')).click()
    await browser.$('div=エクスポートが完了しました！').waitForDisplayed()
    const exported = unzip(await readFile(path.join(root, 'backup.zip')))
    for (const a of assets)
      assert.equal(
        exported.get(`data/${a.id}/${a.name}.txt`)?.toString(),
        `${a.name} content`,
      )
    await browser.$(button('ZIPファイルからインポート')).click()
    await browser.$('div=インポートが完了しました！').waitForDisplayed()
    await browser.$(button('トップ画面に戻る')).click()
    await browser.waitUntil(
      async () =>
        (await browser.$('main').getText()).includes('10個のアセットのうち'),
      { timeoutMsg: '再取り込み後の登録数が10になりませんでした' },
    )
    const ids: string[] = []
    for (const type of [
      'avatars',
      'avatarWearables',
      'worldObjects',
      'otherAssets',
    ]) {
      const saved = JSON.parse(
        await readFile(
          path.join(root, 'assets/metadata', `${type}.json`),
          'utf8',
        ),
      ).data
      for (const a of saved) {
        ids.push(a.id)
        assert.equal(
          await readFile(
            path.join(root, 'assets/data', a.id, `${a.description.name}.txt`),
            'utf8',
          ),
          `${a.description.name} content`,
        )
      }
    }
    assert.equal(new Set(ids).size, 10)
    await browser.$('input[placeholder="キーワードを入力..."]').setValue('Coat')
    await browser.waitUntil(
      async () => (await browser.$$('main [data-asset-id]')).length === 2,
      { timeoutMsg: '元とコピーのCoatが2件表示されませんでした' },
    )
  },
)
