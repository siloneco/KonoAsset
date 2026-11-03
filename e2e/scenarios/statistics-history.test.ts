import test from 'node:test'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { openSettings } from '../ui.ts'

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
    const firstDate = new Date(today - 5 * 86_400_000)
      .toISOString()
      .slice(0, 10)
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
    await browser.$(`${history} svg[role="application"]`).scrollIntoView()
    await browser.$(`${history} svg[role="application"]`).click()
    await browser.$(`${history} [data-slot="card-title"]`).moveTo()
    const expectHistoryDate = async (offset: number) => {
      const date = new Date(today - (5 - offset) * 86_400_000)
        .toISOString()
        .slice(0, 10)
      await browser.waitUntil(
        async () => {
          const tooltip = browser.$(`${history} .recharts-tooltip-wrapper`)
          return (
            (await tooltip.isDisplayed()) &&
            (await tooltip.getText()).includes(date)
          )
        },
        { timeoutMsg: `登録履歴で${date}を選択できませんでした` },
      )
    }
    // Mouse hover and keyboard selection have separate state in Recharts 3.
    // Navigate to a neighbour before returning to the first keyboard entry.
    await browser.keys('ArrowRight')
    await expectHistoryDate(1)
    await browser.keys('ArrowLeft')
    await expectHistoryDate(0)
    await browser.waitUntil(
      async () => {
        const tooltip = browser.$(`${history} .recharts-tooltip-wrapper`)
        const text = (await tooltip.getText()).replace(/\s+/g, '')
        return (
          (await tooltip.isDisplayed()) &&
          text.includes(firstDate) &&
          [
            'アバター素体1',
            'アバター関連アセット0',
            'ワールドアセット0',
            'その他0',
          ].every((expected) => text.includes(expected))
        )
      },
      { timeoutMsg: '登録履歴の最初の日を確認できませんでした' },
    )
    for (let i = 1; i <= 5; i++) {
      await browser.keys('ArrowRight')
      await expectHistoryDate(i)
    }
    await browser.waitUntil(
      async () => {
        const tooltip = browser.$(`${history} .recharts-tooltip-wrapper`)
        const text = (await tooltip.getText()).replace(/\s+/g, '')
        return (
          (await tooltip.isDisplayed()) &&
          [
            'アバター素体1',
            'アバター関連アセット2',
            'ワールドアセット1',
            'その他1',
          ].every((expected) => text.includes(expected))
        )
      },
      { timeoutMsg: '登録履歴の最後の内訳が現在の登録数と一致しませんでした' },
    )
  },
)
