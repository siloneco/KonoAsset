import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { button, openSettings } from '../ui.ts'

test(
  '登録数・タイプ別の内訳とディスク容量を確認し、リロード後も集計できる',
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
    for (const [label, count] of [
      ['アセット登録数', 5],
      ['アバター素体', 1],
      ['アバター関連アセット', 2],
      ['ワールドアセット', 1],
      ['その他', 1],
    ] as const) {
      await browser.waitUntil(
        async () =>
          (
            await browser
              .$(
                `[role="group"][aria-label="${label}"] [data-slot="card-content"]`,
              )
              .getText()
          ).startsWith(String(count)),
        { timeoutMsg: `${label} が ${count} と表示されませんでした` },
      )
    }
    await browser.waitUntil(
      async () =>
        (
          await browser.$$(
            '[data-testid="asset-type-chart"] .recharts-pie-sector',
          )
        ).length === 4 &&
        (
          await browser.$('[data-testid="asset-type-chart"]').getText()
        ).includes('5'),
      { timeoutMsg: 'タイプ別グラフに4タイプと合計5が表示されませんでした' },
    )
    await browser
      .$('[data-testid="asset-type-chart"] path[name="avatars"]')
      .moveTo()
    await browser.waitUntil(
      async () => {
        const tooltip = browser.$(
          '[data-testid="asset-type-chart"] .recharts-tooltip-wrapper',
        )
        return (
          (await tooltip.isDisplayed()) &&
          (await tooltip.getText()).includes('アバター素体') &&
          (await tooltip.getText()).includes('1')
        )
      },
      { timeoutMsg: 'タイプ別グラフのホバーで内訳を確認できませんでした' },
    )
    const history = '[data-testid="asset-history-chart"]'
    await browser.$(`${history} svg[role="application"]`).scrollIntoView()
    await browser.$(`${history} svg[role="application"]`).click()
    for (let i = 0; i < 8; i++) await browser.keys('ArrowLeft')
    await browser.waitUntil(
      async () => {
        const tooltip = browser.$(`${history} .recharts-tooltip-wrapper`)
        const text = (await tooltip.getText()).replace(/\s+/g, '')
        return (
          (await tooltip.isDisplayed()) &&
          text.includes(firstDate) &&
          text.includes('アバター素体1')
        )
      },
      { timeoutMsg: '登録履歴の最初の日を確認できませんでした' },
    )
    for (let i = 0; i < 8; i++) await browser.keys('ArrowRight')
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
    for (let reload = 0; reload < 3; reload++) {
      if (reload > 0) {
        await browser.refresh()
        await browser.$('#preference-theme').waitForDisplayed()
        await browser.$(button('統計')).click()
      }
      await browser.waitUntil(
        async () =>
          (await browser
            .$('[data-testid="asset-disk-usage"]')
            .getAttribute('aria-busy')) === 'false' &&
          (
            await browser.$$(
              '[data-testid="asset-disk-usage"] .recharts-bar-rectangle',
            )
          ).length === 5,
        { timeoutMsg: 'リロード後に5アセットの容量集計が完了しませんでした' },
      )
    }
    await browser.waitUntil(
      async () =>
        (
          await browser.$$(
            '[data-testid="asset-disk-usage"] path.recharts-rectangle[name]',
          )
        ).length === 5,
      {
        timeoutMsg:
          '容量グラフのアニメーション後に5本の棒が描画されませんでした',
      },
    )
    const plottedNames = await browser.execute(() =>
      Array.from(
        document.querySelectorAll(
          '[data-testid="asset-disk-usage"] path.recharts-rectangle[name]',
        ),
        (el) => el.getAttribute('name')!,
      ),
    )
    assert.deepEqual(
      plottedNames.toSorted(),
      assets.map((a) => a.name).toSorted(),
    )
    const sizes = plottedNames.map((name) =>
      Buffer.byteLength(`${name} content`),
    )
    assert.deepEqual(
      sizes,
      sizes.toSorted((a, b) => b - a),
      '容量グラフはサイズの降順で表示する',
    )
    await browser
      .$('[data-testid="asset-disk-usage"] path[name="Blouse"]')
      .scrollIntoView()
    await browser
      .$('[data-testid="asset-disk-usage"] path[name="Blouse"]')
      .moveTo()
    await browser.waitUntil(
      async () => {
        const tooltip = browser.$(
          '[data-testid="asset-disk-usage"] .recharts-tooltip-wrapper',
        )
        return (
          (await tooltip.isDisplayed()) &&
          (await tooltip.getText()).includes('Blouse') &&
          (await tooltip.getText()).includes('14 Bytes')
        )
      },
      {
        timeoutMsg:
          '容量グラフのホバーでアセット名とサイズを確認できませんでした',
      },
    )
  },
)
