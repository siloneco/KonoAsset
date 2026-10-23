import assert from 'node:assert/strict'
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { library } from '../fixtures.ts'
import { button, card, openSettings } from '../ui.ts'

test(
  '使用中画像の最適化と不要画像の削除を行い、再起動後もサムネイルを表示できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      preference: { useTrashBin: false },
      initialData: async (root) => {
        await library(root)
        const images = path.join(root, 'assets/images')
        await mkdir(images, { recursive: true })
        for (const name of ['used.jpg', 'unused.jpg'])
          await copyFile(
            new URL(
              '../../src-backend/test/images/thumbnail.jpg',
              import.meta.url,
            ),
            path.join(images, name),
          )
        const file = path.join(root, 'assets/metadata/avatars.json')
        const metadata = JSON.parse(await readFile(file, 'utf8'))
        metadata.data[0].description.imageFilename = 'used.jpg'
        await writeFile(file, JSON.stringify(metadata))
      },
    })
    const { browser, root } = app
    await openSettings(browser)
    async function expectCounts(resize: number, remove: number) {
      await browser.$(button('最適化する')).click()
      await browser.waitUntil(
        async () => {
          const text = (await browser.$('[role="dialog"]').getText()).replace(
            /\s+/g,
            ' ',
          )
          return (
            text.includes(`最適化可能なサムネイル画像: ${resize}枚`) &&
            text.includes(
              `使用されておらず、削除可能なサムネイル画像: ${remove}枚`,
            )
          )
        },
        { timeoutMsg: `最適化候補が ${resize}/${remove} 枚になりませんでした` },
      )
    }
    await expectCounts(1, 1)
    await browser.$(button('キャンセル', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await access(path.join(root, 'assets/images/used.jpg'))
    await access(path.join(root, 'assets/images/unused.jpg'))
    await expectCounts(1, 1)
    await browser.$(button('開始', '//*[@role="dialog"]')).click()
    await browser.$('div=最適化が完了しました！').waitForDisplayed()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await expectCounts(0, 0)
    assert.equal(
      await browser.$(button('開始', '//*[@role="dialog"]')).isEnabled(),
      false,
    )
    await browser.$(button('キャンセル', '//*[@role="dialog"]')).click()
    await browser.$(button('トップ画面に戻る')).click()
    const imageMetadata = JSON.parse(
      await readFile(path.join(root, 'assets/metadata/avatars.json'), 'utf8'),
    )
    const filename: string = imageMetadata.data[0].description.imageFilename
    const imageLoaded = async (browser: typeof app.browser) => {
      await browser.waitUntil(
        async () =>
          browser.execute(
            (selector, filename) => {
              const img = document.querySelector<HTMLImageElement>(
                `${selector} img`,
              )
              return Boolean(
                img?.complete &&
                img.naturalWidth > 0 &&
                img.naturalWidth <= 300 &&
                img.src.includes(filename),
              )
            },
            card('Aster'),
            filename,
          ),
        { timeoutMsg: '最適化したサムネイルが表示されませんでした' },
      )
    }
    await imageLoaded(browser)
    await imageLoaded(await app.restart())
    await assert.rejects(access(path.join(root, 'assets/images/unused.jpg')), {
      code: 'ENOENT',
    })
  },
)
