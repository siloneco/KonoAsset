import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { pickers } from '../fixtures.ts'
import { openSettings } from '../ui.ts'

test(
  '独自の言語ファイルを読み込み、翻訳とフォールバック・余分なキーの件数を確認できる',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: async (root) => {
        const language = JSON.parse(
          await readFile(
            new URL('../../src/locales/ja-JP.json', import.meta.url),
            'utf8',
          ),
        )
        language.language = 'e2e-custom'
        language.data['preference:settings:theme'] = 'E2Eテーマ'
        delete language.data['general:button:save']
        language.data['e2e:extra'] = 'extra'
        const file = path.join(root, 'language.json')
        await writeFile(file, JSON.stringify(language))
        await pickers(root, [{ kind: 'open', multiple: false, response: file }])
      },
    })
    await openSettings(browser)
    await browser.$('#preference-language').click()
    await browser
      .$('//*[@role="option" and normalize-space(.)="ファイルから読み込む"]')
      .click()
    await browser.$('label=E2Eテーマ').waitForDisplayed()
    await browser.$('div=言語ファイルを読み込みました').waitForDisplayed()
    await browser
      .$('div=フォールバック済み: 1個、不要な値: 1個')
      .waitForDisplayed()
    await browser.waitUntil(
      async () =>
        (await browser.$('#preference-language').getText()) ===
        'カスタム (e2e-custom)',
      { timeoutMsg: '読み込んだ言語名が表示されませんでした' },
    )
  },
)
