import assert from 'node:assert/strict'
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { TestContext } from 'node:test'
import { startApp } from './app.ts'
import { pickers } from './fixtures.ts'
import { zip } from './archive.ts'
import { addManually, button, openSettings, submitAsset } from './ui.ts'

export async function importScenario(
  t: TestContext,
  config: {
    type: string
    metadata: string
    mode: 'file' | 'folder' | 'extract' | 'archive'
  },
) {
  const name = `Local ${config.metadata}`
  const app = await startApp(t, {
    initialData: async (root) => {
      const input = path.join(root, 'input')
      await mkdir(input)
      await writeFile(path.join(input, 'payload.txt'), 'local payload')
      await mkdir(path.join(input, 'bundle'))
      await writeFile(path.join(input, 'bundle/nested.txt'), 'nested payload')
      await writeFile(
        path.join(input, 'bundle.zip'),
        zip({ 'inside.txt': 'zip payload' }),
      )
      const source =
        config.mode === 'folder'
          ? 'bundle'
          : config.mode === 'file'
            ? 'payload.txt'
            : 'bundle.zip'
      await pickers(root, [
        ...(config.mode === 'file'
          ? [
              {
                kind: 'open' as const,
                directory: false,
                multiple: true,
                response: null,
              },
            ]
          : []),
        {
          kind: 'open',
          directory: config.mode === 'folder',
          multiple: true,
          response: [path.join(input, source)],
        },
      ])
    },
  })
  const { browser, root } = app
  if (config.mode === 'file') {
    await browser.$('button[aria-label="アセットを追加"]').click()
    await browser.$(button('ファイルを選択する', '//*[@role="dialog"]')).click()
    await browser
      .$(button('ファイルを選択する', '//*[@role="dialog"]'))
      .waitForDisplayed()
    await browser.$(button('キャンセル', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.$('p=アセットが1つも登録されていません').waitForDisplayed()
  }
  if (config.mode === 'archive') {
    await openSettings(browser)
    await browser
      .$('[role="switch"][aria-label="ZIPファイルを自動で展開する"]')
      .click()
    await browser
      .$(
        '[role="switch"][aria-label="インポート後に元ファイル/フォルダを削除する"]',
      )
      .click()
    await browser.waitUntil(
      async () =>
        (await app.readPreference()).deleteOnImport &&
        !(await app.readPreference()).zipExtraction,
      { timeoutMsg: 'ZIP保持と元データ削除の設定が保存されませんでした' },
    )
    await browser.$(button('トップ画面に戻る')).click()
  }
  await addManually(browser, config.type, name, config.mode === 'folder')
  if (config.mode === 'archive') {
    assert.equal(
      await browser
        .$('[role="dialog"] [role="checkbox"]')
        .getAttribute('aria-checked'),
      'true',
    )
  }
  await submitAsset(browser, name)
  const saved = JSON.parse(
    await readFile(
      path.join(root, 'assets/metadata', `${config.metadata}.json`),
      'utf8',
    ),
  ).data
  assert.equal(saved.length, 1)
  assert.equal(saved[0].description.name, name)
  assert.equal(saved[0].description.creator, 'Local Shop')
  assert.equal(saved[0].description.memo, `${name} のメモ`)
  const destination = path.join(root, 'assets/data', saved[0].id)
  const files = await readdir(destination, { recursive: true })
  if (config.mode === 'file')
    assert.equal(
      await readFile(path.join(destination, 'payload.txt'), 'utf8'),
      'local payload',
    )
  if (config.mode === 'folder') {
    assert.ok(files.some((file) => file.endsWith('nested.txt')))
  }
  if (config.mode === 'extract') {
    const extracted = files.find((file) => file.endsWith('inside.txt'))!
    assert.ok(extracted, 'ZIP must be extracted')
    assert.equal(
      await readFile(path.join(destination, extracted), 'utf8'),
      'zip payload',
    )
  }
  if (config.mode === 'archive') {
    assert.ok(files.includes('bundle.zip'))
    assert.equal(
      files.some((file) => file.endsWith('inside.txt')),
      false,
    )
    await assert.rejects(access(path.join(root, 'input/bundle.zip')), {
      code: 'ENOENT',
    })
  } else {
    const source =
      config.mode === 'folder'
        ? 'bundle/nested.txt'
        : config.mode === 'file'
          ? 'payload.txt'
          : 'bundle.zip'
    await access(path.join(root, 'input', source))
  }
  // Also prove the submitted values load back into a user's editable form.
  await browser.$('main button[aria-label="アセットの操作"]').click()
  await browser
    .$('//*[@role="menuitem" and normalize-space(.)="情報を編集"]')
    .click()
  await browser.$(button('スキップする', '//*[@role="dialog"]')).click()
  await browser.$(button('次へ', '//*[@role="dialog"]')).click()
  await browser.waitUntil(
    async () =>
      (await browser
        .$('input[placeholder="アセットの名前を入力..."]')
        .getValue()) === name,
    { timeoutMsg: '取り込んだ情報を編集画面で読み戻せませんでした' },
  )
}
