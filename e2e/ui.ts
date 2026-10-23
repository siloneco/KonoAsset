import type { startApp } from './app.ts'
import { assets } from './fixtures.ts'

export type Browser = Awaited<ReturnType<typeof startApp>>['browser']
export const button = (name: string, scope = '') =>
  `${scope}//button[normalize-space(.)="${name}"]`
export const card = (name: string) =>
  `[data-asset-id="${assets.find((a) => a.name === name)!.id}"]`

export async function replaceInput(
  browser: Browser,
  selector: string,
  value: string,
) {
  await browser.$(selector).click()
  await browser.keys(['Control', 'a'])
  if (value.length === 0) await browser.keys('Backspace')
  else await browser.$(selector).addValue(value)
}

export async function openSettings(browser: Browser, tab?: string) {
  await browser.$('button[aria-label="一般設定"]').click()
  await browser.$('#preference-theme').waitForDisplayed()
  if (tab) await browser.$(button(tab)).click()
}

export async function expectAssets(
  browser: Browser,
  names: string[],
  ordered = false,
) {
  const expected = assets.filter((a) => names.includes(a.name)).map((a) => a.id)
  const orderedIds = names.map(
    (name) => assets.find((a) => a.name === name)!.id,
  )
  await browser.waitUntil(
    async () => {
      // Read one DOM snapshot so a React commit cannot invalidate half an array.
      const ids = await browser.execute(() =>
        Array.from(document.querySelectorAll('main [data-asset-id]'), (el) =>
          el.getAttribute('data-asset-id')!,
        ),
      )
      if (ordered) return JSON.stringify(ids) === JSON.stringify(orderedIds)
      return JSON.stringify(ids.sort()) === JSON.stringify(expected.toSorted())
    },
    { timeoutMsg: `一覧が ${names.join(', ')} に更新されませんでした` },
  )
  if (names.length === 0)
    await browser
      .$('p=フィルタ条件を満たすアセットがありません')
      .waitForDisplayed()
}

export async function clearFilters(browser: Browser) {
  // The top status bar remains available even when no rows match.
  await browser.$('[data-testid="clear-filters"]').click()
  await expectAssets(
    browser,
    assets.map((a) => a.name),
  )
}

export async function chooseFilter(
  browser: Browser,
  group: string,
  value: string,
) {
  const scope = `[role="group"][aria-label="${group}"]`
  await browser.$(`${scope} input`).setValue(value)
  await browser
    .$(`${scope} [role="option"][data-value="${value.replace(/^-/, '')}"]`)
    .click()
  await browser.keys('Escape')
}

export async function assetMenu(
  browser: Browser,
  name: string,
  action: string,
) {
  await browser.$(`${card(name)} button[aria-label="アセットの操作"]`).click()
  await browser
    .$(`//*[@role="menuitem" and normalize-space(.)="${action}"]`)
    .click()
}

export async function manualEdit(browser: Browser, name: string) {
  await assetMenu(browser, name, '情報を編集')
  await browser.$(button('スキップする', '//*[@role="dialog"]')).click()
  await browser.$(button('次へ', '//*[@role="dialog"]')).click()
  await browser
    .$('input[placeholder="アセットの名前を入力..."]')
    .waitForDisplayed()
}

export async function addManually(
  browser: Browser,
  type: string,
  name: string,
  directory = false,
) {
  await browser.$('button[aria-label="アセットを追加"]').click()
  await browser
    .$(
      button(
        directory ? 'フォルダを選択する' : 'ファイルを選択する',
        '//*[@role="dialog"]',
      ),
    )
    .click()
  await browser.$(button('自動取得をスキップ', '//*[@role="dialog"]')).click()
  await browser.$(button(type, '//*[@role="dialog"]')).click()
  await browser.$(button('次へ', '//*[@role="dialog"]')).click()
  await browser.$('input[placeholder="アセットの名前を入力..."]').setValue(name)
  await browser
    .$('input[placeholder="ショップの名前を入力..."]')
    .setValue('Local Shop')
  await browser.$(button('次へ', '//*[@role="dialog"]')).click()
  await browser.$('textarea').setValue(`${name} のメモ`)
}

export async function submitAsset(browser: Browser, name: string) {
  await browser.$(button('アセットを追加', '//*[@role="dialog"]')).click()
  await browser.$('[role="dialog"]').waitForDisplayed({ reverse: true })
  await browser.$(`main [data-asset-id]`).waitForDisplayed()
  await browser.waitUntil(
    async () => (await browser.$('main').getText()).includes(name),
    { timeoutMsg: `${name} の取り込みが完了しませんでした` },
  )
}
