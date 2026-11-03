import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { button, card, expectAssets, closeDialog, waitForUi } from '../ui.ts'

// Given: A library with memos and dependencies, without BOOTH URLs.
// When: Open memos, dependencies, and the unavailable BOOTH action.
// Then: The selected details and a useful explanation are displayed.
test(
  'Inspect asset memos and dependencies and explain unavailable BOOTH links',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: async (root) => {
        await library(root)
        const file = path.join(root, 'assets/metadata/avatarWearables.json')
        const metadata = JSON.parse(await readFile(file, 'utf8'))
        metadata.data.find(
          (a: { id: string }) => a.id === assets[2].id,
        ).description.dependencies = [assets[0].id, assets[3].id]
        await writeFile(file, JSON.stringify(metadata))
      },
    })
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    for (const name of ['Coat', 'Blouse']) {
      await browser.$(`${card(name)} button[aria-label="メモ"]`).click()
      await browser.$('[role="dialog"]').waitForDisplayed()
      await browser.waitUntil(
        async () =>
          (await browser.$('[role="dialog"]').getText()).includes(
            `${name} のメモ`,
          ),
        { timeoutMsg: `${name} のメモが表示されませんでした` },
      )
      await closeDialog(browser, () =>
        browser.$(button('閉じる', '//*[@role="dialog"]')).click(),
      )
    }
    await browser.$(`${card('Coat')} button[aria-label="開くメニュー"]`).click()
    await browser
      .$('//*[@role="menuitem" and normalize-space(.)="前提アセット"]')
      .click()
    await browser.$(`[role="dialog"] ${card('Aster')}`).waitForDisplayed()
    await browser.$(`[role="dialog"] ${card('Desk')}`).waitForDisplayed()
    await waitForUi(
      browser,
      async () => (await browser.$$('[role="dialog"] [data-asset-id]')).length,
      2,
    )
    await closeDialog(browser, () =>
      browser.$(button('閉じる', '//*[@role="dialog"]')).click(),
    )
    await browser
      .$(`${card('Coat')} button[aria-label="アセットの操作"]`)
      .click()
    const booth = '//*[@role="menuitem" and normalize-space(.)="BOOTHで開く"]'
    await waitForUi(
      browser,
      async () => await browser.$(booth).getAttribute('aria-disabled'),
      'true',
    )
    await browser.$('[data-testid="booth-url-tooltip"]').moveTo()
    await browser.$('[role="tooltip"]').waitForDisplayed()
    await waitForUi(
      browser,
      async () => await browser.$('[role="tooltip"]').getText(),
      'BOOTH URLが設定されていません！',
    )
  },
)
