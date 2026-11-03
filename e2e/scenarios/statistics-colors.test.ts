import test from 'node:test'
import { startApp } from '../app.ts'
import { libraryWithRegistrationHistory } from '../fixtures.ts'
import { button, openSettings, type Browser } from '../ui.ts'

// Given: A library with all four asset types and recent registration history.
// When: View statistics in light and dark themes, then reload the renderer.
// Then: Every pie slice and history series retains its asset-type color.
test(
  'Keep statistics chart colors when switching themes and reloading',
  { timeout: 90_000 },
  async (t) => {
    const { browser } = await startApp(t, {
      initialData: libraryWithRegistrationHistory,
    })

    async function expectChartColors(browser: Browser) {
      for (const [chart, selector, property] of [
        ['asset-type-chart', 'path.recharts-sector', 'fill'],
        ['asset-history-chart', 'path.recharts-area-area', 'fill'],
        ['asset-history-chart', 'path.recharts-area-curve', 'stroke'],
      ] as const) {
        await browser.$(`[data-testid="${chart}"]`).scrollIntoView()
        await browser.waitUntil(
          async () =>
            browser.execute(
              (chart, selector, property) => {
                const container = document.querySelector(
                  `[data-testid="${chart}"]`,
                )
                if (!container) return false
                // Canvas normalizes theme tokens and computed SVG colors alike.
                const context = document
                  .createElement('canvas')
                  .getContext('2d')!
                const normalize = (color: string) => {
                  if (!CSS.supports('color', color)) return ''
                  context.fillStyle = color
                  return context.fillStyle
                }
                const theme = getComputedStyle(document.documentElement)
                const tokens = [
                  '--avatar',
                  '--avatar-wearable',
                  '--world-object',
                  '--other-asset',
                ].map((name) => theme.getPropertyValue(name).trim())
                if (tokens.some((color) => !color)) return false
                const expected = tokens.map(normalize).sort()
                if (new Set(expected).size !== 4) return false
                const paths = Array.from(
                  container.querySelectorAll<SVGPathElement>(selector),
                )
                if (
                  paths.length !== 4 ||
                  paths.some((path) => {
                    const bounds = path.getBBox()
                    const style = getComputedStyle(path)
                    return (
                      bounds.width <= 0 ||
                      (property === 'fill' && bounds.height <= 0) ||
                      style.visibility !== 'visible' ||
                      Number(style.opacity) <= 0 ||
                      Number(style.getPropertyValue(`${property}-opacity`)) <= 0
                    )
                  })
                )
                  return false
                const actual = paths
                  .map((path) =>
                    normalize(
                      getComputedStyle(path).getPropertyValue(property),
                    ),
                  )
                  .sort()
                return actual.every((color, index) => color === expected[index])
              },
              chart,
              selector,
              property,
            ),
          {
            timeoutMsg: `${chart} did not render all four asset-type ${property} colors`,
          },
        )
      }
    }

    await openSettings(browser, '統計')
    await expectChartColors(browser)
    for (const [theme, label] of [
      ['dark', 'ダーク'],
      ['light', 'ライト'],
    ] as const) {
      await browser.$(button('一般設定')).click()
      await browser.$('#preference-theme').click()
      await browser
        .$(`//*[@role="option" and normalize-space(.)="${label}"]`)
        .click()
      await browser.waitUntil(
        async () =>
          ((await browser.$('html').getAttribute('class')) ?? '')
            .split(/\s+/)
            .includes(theme),
        { timeoutMsg: `${theme} theme was not applied` },
      )
      await browser.$(button('統計')).click()
      await expectChartColors(browser)
    }
    await browser.refresh()
    await browser.$('#preference-theme').waitForDisplayed()
    await browser.$(button('統計')).click()
    await expectChartColors(browser)
  },
)
