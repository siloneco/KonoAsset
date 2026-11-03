import test from 'node:test'
import { startApp } from '../app.ts'
import { libraryWithRegistrationHistory } from '../fixtures.ts'
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
      initialData: libraryWithRegistrationHistory,
    })
    await openSettings(browser, '統計')
    const history = '[data-testid="asset-history-chart"]'
    const firstDate = new Date(today - 5 * 86_400_000)
      .toISOString()
      .slice(0, 10)
    await browser.waitUntil(
      async () =>
        (
          await browser.$(`${history} .recharts-xAxis-tick-labels`).getText()
        ).includes(firstDate),
      { timeoutMsg: '登録履歴の日付が表示されませんでした' },
    )
    await focusWithKeyboard(browser, `${history} svg[role="application"]`)
    await browser.keys('Tab')
    await browser.keys(['Shift', 'Tab'])
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
