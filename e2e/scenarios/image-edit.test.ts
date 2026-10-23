import assert from 'node:assert/strict'
import { access, copyFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library, pickers } from '../fixtures.ts'
import { button, card, expectAssets, manualEdit } from '../ui.ts'

test(
  '画像を選んでサムネイルを変更し、保存後と再起動後の一覧で表示できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const file = path.join(root, 'thumbnail.jpg')
        await copyFile(
          new URL(
            '../../src-backend/test/images/thumbnail.jpg',
            import.meta.url,
          ),
          file,
        )
        await pickers(root, [
          { kind: 'open', directory: false, multiple: false, response: file },
        ])
      },
    })
    const { browser, root } = app
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    await manualEdit(browser, 'Coat')
    await browser.$('[data-testid="square-image-path-selector"]').click()
    await browser.waitUntil(
      async () =>
        browser.execute(() => {
          const img = document.querySelector<HTMLImageElement>(
            '[role="dialog"] img',
          )
          return Boolean(img?.complete && img.naturalWidth === 300)
        }),
      { timeoutMsg: '選択画像が編集画面に表示されませんでした' },
    )
    await browser.$(button('次へ', '//*[@role="dialog"]')).click()
    await browser.$(button('アセットを更新', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    const saved = JSON.parse(
      await readFile(
        path.join(root, 'assets/metadata/avatarWearables.json'),
        'utf8',
      ),
    ).data.find((a: { id: string }) => a.id === assets[2].id)
    const filename: string = saved.description.imageFilename
    assert.ok(filename)
    await access(
      path.join(root, 'assets/images', saved.description.imageFilename),
    )
    async function expectImage(browser: typeof app.browser) {
      await browser.waitUntil(
        async () =>
          browser.execute(
            (selector, filename) => {
              const img = document.querySelector<HTMLImageElement>(
                `${selector} img`,
              )
              return Boolean(
                img?.complete &&
                img.naturalWidth === 300 &&
                img.src.includes(filename),
              )
            },
            card('Coat'),
            filename,
          ),
        { timeoutMsg: '保存した画像が一覧に表示されませんでした' },
      )
    }
    await expectImage(browser)
    await expectImage(await app.restart())
  },
)
