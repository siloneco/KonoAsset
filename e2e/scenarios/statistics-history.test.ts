import test from 'node:test'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { focusWithKeyboard, openSettings } from '../ui.ts'

// Given: A library with one registration per day inside the rolling history window.
// When: Navigate the registration history using the keyboard.
// Then: The selected dates and cumulative totals match the prepared library.
test(
  'Inspect cumulative registration history using keyboard navigation',
  { timeout: 90_000 },
  async (t) => {
    const now = new Date()
    const today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    )
    const { browser } = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        // Keep the history inside the app's rolling 180-day window explicitly.
        for (const type of [
          'avatars',
          'avatarWearables',
          'worldObjects',
          'otherAssets',
        ]) {
          const file = path.join(root, 'assets/metadata', `${type}.json`)
          const metadata = JSON.parse(await readFile(file, 'utf8'))
          for (const a of metadata.data)
            a.description.createdAt =
              today -
              (5 - assets.findIndex((fixture) => fixture.id === a.id)) *
                86_400_000
          await writeFile(file, JSON.stringify(metadata))
        }
      },
    })
    await openSettings(browser, '統計')
    const history = '[data-testid="asset-history-chart"]'
    await focusWithKeyboard(browser, `${history} svg[role="application"]`)
    const expectHistory = async (offset: number, counts: number[]) => {
      const date = new Date(today - (5 - offset) * 86_400_000)
        .toISOString()
        .slice(0, 10)
      const labels = [
        'アバター素体',
        'アバター関連アセット',
        'ワールドアセット',
        'その他',
      ]
      await browser.waitUntil(
        async () => {
          const tooltip = browser.$(`${history} .recharts-tooltip-wrapper`)
          const text = (await tooltip.getText()).replace(/\s+/g, '')
          return (
            (await tooltip.isDisplayed()) &&
            text.includes(date) &&
            labels.every((label, index) =>
              text.includes(`${label}${counts[index]}`),
            )
          )
        },
        { timeoutMsg: `登録履歴で${date}の内訳を確認できませんでした` },
      )
    }

    await expectHistory(0, [1, 0, 0, 0])
    await browser.keys('ArrowRight')
    await expectHistory(1, [1, 1, 0, 0])
    await browser.keys('ArrowLeft')
    await expectHistory(0, [1, 0, 0, 0])
    for (const [offset, counts] of [
      [1, [1, 1, 0, 0]],
      [2, [1, 2, 0, 0]],
      [3, [1, 2, 1, 0]],
      [4, [1, 2, 1, 1]],
      [5, [1, 2, 1, 1]],
    ] as const) {
      await browser.keys('ArrowRight')
      await expectHistory(offset, [...counts])
    }
  },
)
