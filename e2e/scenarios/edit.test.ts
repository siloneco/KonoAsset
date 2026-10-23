import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { startApp } from '../app.ts'
import { assets, library } from '../fixtures.ts'
import { button, card, expectAssets, manualEdit, replaceInput } from '../ui.ts'

test(
  '登録情報・タグ・対応アバター・メモ・前提を編集し、再表示と再起動で確認できる',
  { timeout: 90_000 },
  async (t) => {
    const app = await startApp(t, { initialData: library })
    const { browser, root } = app
    await expectAssets(
      browser,
      assets.map((a) => a.name),
    )
    await manualEdit(browser, 'Coat')
    assert.equal(
      await browser
        .$('input[placeholder="アセットの名前を入力..."]')
        .getValue(),
      'Coat',
    )
    assert.equal(
      await browser
        .$('input[placeholder="ショップの名前を入力..."]')
        .getValue(),
      'Maple-B',
    )
    await replaceInput(
      browser,
      'input[placeholder="アセットの名前を入力..."]',
      'Coat 改',
    )
    await replaceInput(
      browser,
      'input[placeholder="ショップの名前を入力..."]',
      'New Shop',
    )
    await replaceInput(
      browser,
      '[role="dialog"] input[placeholder="カテゴリを選択..."]',
      '新カテゴリ',
    )
    await browser
      .$(
        '//*[@role="dialog"]//label[normalize-space(.)="タグ"]/following-sibling::*//input',
      )
      .setValue('共通')
    await browser
      .$('[role="dialog"] [role="option"][data-value="共通"]')
      .click()
    // Select an existing avatar suggestion, then remove it again before choosing it.
    const avatarInput =
      '//*[@role="dialog"]//label[normalize-space(.)="対応アバター"]/following-sibling::*//input'
    await browser.$(avatarInput).setValue('Birch')
    await browser
      .$('[role="dialog"] [role="option"][data-value="Birch"]')
      .click()
    await browser
      .$('//*[@role="dialog"]//*[@data-badge][span="Birch"]//button')
      .click()
    await browser.$(avatarInput).setValue('Birch')
    await browser
      .$('[role="dialog"] [role="option"][data-value="Birch"]')
      .click()
    await browser.$(button('次へ', '//*[@role="dialog"]')).click()
    await replaceInput(browser, 'textarea', '編集したメモ\n2行目')
    await browser
      .$('input[placeholder="前提アセットを検索..."]')
      .setValue('Aster')
    await browser.$(`[role="dialog"] ${card('Aster')} button`).click()
    await browser.$(`[role="dialog"] ${card('Aster')} button`).click()
    await replaceInput(
      browser,
      'input[placeholder="前提アセットを検索..."]',
      'Desk',
    )
    await browser.$(`[role="dialog"] ${card('Desk')} button`).click()
    await browser.$(button('アセットを更新', '//*[@role="dialog"]')).click()
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await browser.waitUntil(
      async () => (await browser.$(card('Coat')).getText()).includes('Coat 改'),
      { timeoutMsg: '変更した名前が一覧に表示されませんでした' },
    )
    await manualEdit(browser, 'Coat')
    assert.equal(
      await browser
        .$('input[placeholder="アセットの名前を入力..."]')
        .getValue(),
      'Coat 改',
    )
    await browser.$(button('次へ', '//*[@role="dialog"]')).click()
    assert.equal(await browser.$('textarea').getValue(), '編集したメモ\n2行目')
    await browser.$(`[role="dialog"] ${card('Desk')}`).waitForDisplayed()
    await browser.keys('Escape')
    // Opening a different asset must not reuse the edited form's values.
    await manualEdit(browser, 'Blouse')
    assert.equal(
      await browser
        .$('input[placeholder="アセットの名前を入力..."]')
        .getValue(),
      'Blouse',
    )
    await replaceInput(
      browser,
      'input[placeholder="アセットの名前を入力..."]',
      '保存しない変更',
    )
    await browser.keys('Escape')
    await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
    await manualEdit(browser, 'Blouse')
    assert.equal(
      await browser
        .$('input[placeholder="アセットの名前を入力..."]')
        .getValue(),
      'Blouse',
    )
    await browser.keys('Escape')
    const saved = JSON.parse(
      await readFile(
        path.join(root, 'assets/metadata/avatarWearables.json'),
        'utf8',
      ),
    ).data.find((a: { id: string }) => a.id === assets[2].id)
    assert.equal(saved.category, '新カテゴリ')
    assert.deepEqual(saved.supportedAvatars.toSorted(), ['Aster', 'Birch'])
    assert.deepEqual(
      saved.description.tags.toSorted(),
      ['共通', '青'].toSorted(),
    )
    assert.deepEqual(saved.description.dependencies, [assets[3].id])
    const next = await app.restart()
    await manualEdit(next, 'Coat')
    assert.equal(
      await next.$('input[placeholder="アセットの名前を入力..."]').getValue(),
      'Coat 改',
    )
  },
)
