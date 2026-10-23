import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { pickers } from '../fixtures.ts'
import { button, openSettings } from '../ui.ts'

test(
  '初回起動で言語・テーマ・保存先・動作を設定して利用を開始し、再起動後も保持する',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, {
      setup: true,
      initialData: async (root) => {
        await mkdir(path.join(root, 'chosen'))
        await pickers(root, [
          {
            kind: 'open',
            directory: true,
            multiple: false,
            response: path.join(root, 'chosen'),
          },
        ])
      },
    })
    const { browser, root } = app
    const active = '//*[@role="tabpanel" and @data-state="active"]'
    await browser.$('div=日本語').click()
    for (const [label, theme] of [
      ['ライト', 'light'],
      ['ダーク', 'dark'],
    ]) {
      await browser.$(`[role="button"][aria-label="${label}"]`).click()
      await browser.waitUntil(
        async () =>
          ((await browser.$('html').getAttribute('class')) ?? '')
            .split(/\s+/)
            .includes(theme),
        { timeoutMsg: `初期設定で${label}が反映されませんでした` },
      )
    }
    await browser.$(button('次へ', active)).click()
    await browser.$('[data-slot="tabs"][aria-busy="false"]').waitForDisplayed()
    await browser.$(button('選択', active)).click()
    await browser.waitUntil(
      async () =>
        (await browser
          .$('[role="tabpanel"][data-state="active"] input')
          .getValue()) === path.join(root, 'chosen'),
      { timeoutMsg: '初期設定で選択した保存先が表示されませんでした' },
    )
    await browser.$(button('次へ', active)).click()
    await browser.$('[data-slot="tabs"][aria-busy="false"]').waitForDisplayed()
    await browser
      .$('[role="switch"][aria-label="ZIPファイルを自動で展開する"]')
      .click()
    await browser.$(button('利用をはじめる！', active)).click()
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
    await browser.waitUntil(
      async () =>
        (await app.readPreference()).dataDirPath ===
          path.join(root, 'chosen') &&
        (await app.readPreference()).theme === 'dark' &&
        !(await app.readPreference()).zipExtraction,
      { timeoutMsg: '初期設定が保存されませんでした' },
    )
    const next = await app.restart()
    await openSettings(next)
    assert.equal(await next.$('#preference-theme').getText(), 'ダーク')
    assert.equal(
      await next
        .$('[role="switch"][aria-label="ZIPファイルを自動で展開する"]')
        .getAttribute('aria-checked'),
      'false',
    )
  },
)
