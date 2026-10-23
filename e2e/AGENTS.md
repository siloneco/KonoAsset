# E2E Test Implementation Guidelines

Verify that users can accomplish their goals through independently reproducible scenarios.
Do not aim to maximize the number of tests or clicks.

Do not copy existing tests blindly when they use patterns that differ from these guidelines.

## Preserve the Current Setup

- Use TypeScript, Node.js 24's `node:test`, WebdriverIO's `remote()`, and the official `tauri-driver`.
- Run TypeScript using Node.js type stripping. Use `import type` for dependencies needed only for types, and include the `.ts` extension in local runtime imports.
- Place tests in the current discovery pattern, `e2e/scenarios/*.test.ts`, with one scenario per file as the default. Keep shared helpers and build infrastructure directly under `e2e/`.
- Call `startApp(t)` in each scenario to create a fresh application, WebDriver session, and dataset.
- Keep concurrency fixed at `--test-concurrency=10` in `package.json`. Do not effectively exceed this limit in regular scenarios by adding concurrent tests within a file or launching extra application instances.
- `node:assert/strict` evaluates immediately; it does not automatically retry UI assertions. Do not assume WDIO Runner globals such as `browser` / `$` / `expect`, Playwright APIs, or services that are not installed.
- Use the E2E Cargo feature and dedicated binary. Do not reuse regular builds or real users' profiles for testing.

With the default process isolation, `--test-concurrency` controls the number of test files running concurrently.

## 1. Design Scenarios Around User Goals

Explicitly describe each scenario's preconditions, user actions, and observable outcomes.
Write test names in Japanese to describe what the user can accomplish, rather than which function is called.

- Cover one coherent user goal per scenario. A scenario may span multiple screens, actions, and outcome checks needed to accomplish that goal.
- Do not create large numbers of tiny tests for individual buttons or attributes. For a settings change, treat opening settings, making the change, observing the result, and verifying persistence where necessary as one scenario.
- Do not combine unrelated features into one enormous scenario. Use separate scenarios for branches with independent preconditions, goals, or failure causes.
- Do not split one user flow across tests that depend on a previous test's success or saved data.
- Cover exhaustive input combinations, parsers, calculations, and detailed validation boundaries in unit or integration tests. Prioritize representative E2E paths that cross the UI, IPC, Rust, and persistence layers.
- Select important branches with significant user impact, including cancellation, recovery after failure, reopening screens, or restarting the app. Do not mechanically add every branch to every scenario.
- Manage coverage in terms of user goals, important state transitions, and failure risks. Before adding a scenario, be able to explain which guarantee is missing from the existing scenarios.

Example planning table:

| User goal              | Actions and state transitions                                  | Main guarantees                                         |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| Change the theme       | Light → Dark → Light → reload the screen                       | The selection, applied theme, and saved value agree     |
| Delete an asset        | List containing the target → confirm deletion → completed list | Only the selected asset disappears; other assets remain |
| Cancel deletion        | List containing the target → confirmation dialog → cancel      | The dialog closes; the asset and original data remain   |
| Search with no matches | Loaded list → search → search completed                        | An empty result is shown for the submitted query        |

## 2. Perform Actions and Primary Checks Through the User Interface

- Use WebDriver to interact with visible buttons, menus, and inputs in the scenario body. When testing navigation to settings, actually use the settings button.
- Do not bypass the intended flow by modifying the DOM with `browser.execute()`, clicking through JavaScript, directly changing Zustand state or localStorage, or invoking Tauri commands instead of performing user actions.
- Focus verification on displayed content, selected values, whether controls are usable, and generated outputs. Do not base E2E pass/fail conditions on internal function call counts or component structure.
- Supplementary reads of persisted results, such as `readPreference()`, are allowed when verifying persistence. Do not treat a file update alone as success; also verify the UI outcome.
- Use stable attributes, such as the root theme class, selectively when needed to verify a product outcome. Do not lock down the entire appearance through CSS classes or pixel values.
- `browser.refresh()` reloads the renderer; it does not restart the Rust process. Claiming that state survives an application restart requires an actual process restart using the same scenario's isolated data.

## 3. Wait for the Required State Instead of a Fixed Duration

WebdriverIO interaction commands automatically wait until an element is interactable, but do not guarantee that asynchronous work triggered by a click has completed.
Reference: [WebdriverIO Auto-waiting](https://webdriver.io/docs/autowait).

| What to verify                                                          | Approach                                                                        |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Clicking or typing into a control                                       | Rely on the automatic waiting in `click()` / `setValue()` by default            |
| Presence in the DOM                                                     | Use `waitForExist()`; do not assume it guarantees visibility or interactability |
| Visibility to the user                                                  | Use `waitForDisplayed()`                                                        |
| A disabled control becoming usable                                      | Use `waitForEnabled()` / `waitForClickable()` when necessary                    |
| Asynchronous updates to text, attributes, URLs, counts, or saved values | Use `browser.waitUntil()` and read the values again on every attempt            |
| Unchanging values such as initialData or computed constants             | Immediate checks with `node:assert/strict` are sufficient                       |

- Do not rely solely on `assert.equal(await ..., expected)` immediately after an action when the value may update asynchronously. Wait for the update with `waitUntil`.
- To test a state change, start from a state that differs from the expected result. Selecting Dark when the screen is already Dark does not prove that the change path works.
- Do not reuse text, arrays, counts, or file contents captured outside `waitUntil`. Retrying checks against a fixed value is ineffective.
- `isExisting()` / `isDisplayed()` query the current state; they do not wait for an element to appear. Use them inside a wait condition, or use a dedicated `waitFor*` command.
- Do not use `browser.pause()` or scenario-level `setTimeout` calls as precautionary delays. Infrastructure retry intervals, such as bounded polling during driver startup, are a separate concern.
- Do not increase implicit timeouts to stabilize tests. Use the existing explicit waits.
- Give `waitUntil` a `timeoutMsg` that identifies the action and expected state. Normally use the timeout from `app.ts`; adjust individual waits only for a concrete reason, such as a long import.
- Do not equate navigation completion, a URL change, or a disappearing spinner with the screen's data being ready. Also wait for screen-specific content or a completion state.
- When using an event as evidence of completion, register its listener before performing the action. Receiving the event alone does not guarantee that the UI has finished updating; also check the required display state.

References: [waitUntil](https://webdriver.io/docs/api/browser/waitUntil), [isExisting](https://webdriver.io/docs/api/element/isExisting), [isDisplayed](https://webdriver.io/docs/api/element/isDisplayed), and [avoiding fixed pauses](https://webdriver.io/docs/bestpractices#dont-pause).

## 4. Locate Elements Again on Every waitUntil Attempt (Required)

React rendering, list updates, navigation, and reloads can make element references stale.
Locate every element used by a `waitUntil` condition inside that condition on each attempt.
Selector strings, query criteria, and functions or getters that locate fresh elements may live outside the condition; previously located elements or element arrays may not.

In the following examples, `expectedLabel` is the Japanese UI label expected by the scenario.

```ts
// Bad: keep using an element reference from before a render
const selector = browser.$('#preference-theme')
await browser.waitUntil(
  async () => (await selector.getText()) === expectedLabel,
)

// Good: locate the element and read its value on every attempt
const themeSelector = '#preference-theme'
await browser.waitUntil(
  async () => {
    const selector = browser.$(themeSelector)
    if (!(await selector.isDisplayed())) return false
    return (await selector.getText()) === expectedLabel
  },
  { timeoutMsg: 'The theme selection in general settings did not update' },
)
```

- For compound conditions, read each element and saved value again within that attempt. Wait until both the UI and the saved value reach their expected states.
- Keep condition functions read-only. Do not click, type, delete, or reload inside them. Retrying side effects can create duplicate records or toggle state back and forth.
- Do not run actions against the same session concurrently through `Promise.all` or `forEach(async ...)`. Preserve the user's action order with `await` and `for...of`.
- Do not force waits or assertions to pass with `catch(() => true)`. If handling exceptions, handle only specific, expected transient errors. Do not hide disconnected sessions, invalid selectors, or application startup failures.
- Locating an element again will not fix a search in the wrong screen or window. First verify the preceding navigation and current context.

References for locating elements again: [Selenium's explanation of stale elements](https://www.selenium.dev/documentation/webdriver/troubleshooting/errors/#staleelementreferenceexception) and [WebdriverIO's lazy getters](https://webdriver.io/docs/pageobjects#get-ing-your-selectors). Do not assume that previously located WDIO elements always behave like Playwright locators that locate elements again automatically.

## 5. Prevent Premature Success in Disappearance and Absence Checks

When verifying that an element disappears, always establish that it exists before performing the action.
For a target visible to the user, verify visibility rather than mere DOM presence.
`reverse: true` can succeed when the target is absent from the start, so it cannot replace this precondition.
Reference: [the reverse behavior of waitForExist](https://webdriver.io/docs/api/element/waitForExist).

Example deletion scenario. The following `data-testid` values are illustrative; adapt them to the actual UI contract.

```ts
const target = '[data-testid="asset-to-delete"]'
await browser.$(target).waitForDisplayed() // Do not pass on absence before loading
await browser.$('[data-testid="delete-asset"]').click()
await browser.$('[role="alertdialog"]').waitForDisplayed()
await browser.$('[data-testid="confirm-delete"]').click()

await browser.waitUntil(
  async () => {
    const removed = !(await browser.$(target).isExisting())
    const completed = await browser
      .$('[data-testid="delete-completed"]')
      .isDisplayed()
    return removed && completed
  },
  {
    timeoutMsg:
      'Could not confirm deletion completion and target asset removal',
  },
)
```

- Distinguish being hidden from being removed from the DOM. Use `!isDisplayed()` when the element should be hidden and `!isExisting()` when it should be removed.
- In addition to disappearance, verify a stable completion state associated with the action. Replacing the entire list with a loading screen must not count as successful deletion.
- When absence from the start is correct, such as no error banner or an empty dataset, do not artificially display the target first. Instead, establish positive evidence that the screen is ready and the operation being checked has completed.
- Do not identify an empty list solely by a count of `0`. Also verify that the relevant query or screen has finished loading and that its empty state is displayed.
- Loading indicators and toasts are not guaranteed to remain visible long enough to observe. Do not add sleeps to force observation of a short-lived spinner; wait for a lasting outcome.
- In a virtualized list, disappearance from the DOM does not imply data deletion. Verify product behavior by searching for the item or displaying it again, as appropriate.
- A single query cannot prove that something will never appear later. Wait for the relevant operation to complete, or use a dedicated scenario with an explicit observation period when time itself is a requirement.

## 6. Use Selectors as Stable UI Contracts

- Prefer accessible names, labels, roles combined with visible names, and stable IDs. Add `data-testid` when no suitable selector exists.
- Provide meaningful `aria-label` values for icon-only buttons and associate inputs with their labels. Do not invent unnatural accessible names solely for tests.
- Scope elements with the same name to the relevant dialog or row. Do not resolve ambiguity through an incidental `.first()` or array index.
- Avoid long DOM hierarchies, `nth-child`, decorative Tailwind classes, dynamic IDs, and screen coordinates. When XPath is necessary, scope it by the target's role and meaning.
- Labels and completion messages may be fixed expected values to verify that the app operates in Japanese. Do not derive expectations from the app's own translation function, allowing the test to pass even in the wrong language.

Reference: [WebdriverIO's recommended selectors](https://webdriver.io/docs/selectors).

## 7. Isolate initialData and Persistent Data Per Scenario

- Keep preferences, assets, metadata, logs, outputs, and the WebView profile under the unique `root` created by `startApp(t)`. Do not share WebDriver sessions or mutable data between tests.
- Generate `app/preference.json` in v6 format with `ja-JP` before startup to skip setup. Only use explicit, scenario-specific initialData for setup itself when that is the behavior under test.
- Finish writing initialData before launching the app. Do not modify files directly after startup to replace normal UI actions or persistence behavior.
- Even when scenarios use the same fixed asset name, always use separate storage locations. Do not use real users' AppData, Documents, Downloads, or arbitrary existing files as inputs or deletion targets.
- Large datasets do not need to be created through the UI every time. Prepare unrelated preconditions with small, deterministic initialData, while performing the operation under test through the UI.
- Preserve `app.ts`'s design that never falls back to real user data on startup failure. Preserve the E2E startup configuration that disables the single-instance restriction, OS deep-link registration, and startup update checks.
- Wait for the app, WebView, and driver to exit before deleting successful runs' data. Do not delete failure evidence or another scenario's directories.
- Register cleanup immediately after acquiring resources so it also runs if startup or initialData creation fails partway through.

Reference: [Selenium's guidance on avoiding shared state](https://www.selenium.dev/documentation/test_practices/encouraged/avoid_sharing_state/). Follow this repository's `app.ts` and `src-backend/tauri/src/e2e.rs` for concrete directories and startup settings.

## 8. Reduce Uncertainty From External Systems and Native Interactions

- Do not make regular scenarios depend on live public API responses, external websites, real accounts, or real network speeds. Control only the necessary external boundaries with managed initialData or local services.
- When testing flows from the frontend through Rust, do not mock out Tauri IPC and remove the path being tested. Do not assume that WebView network mocks intercept HTTP requests made by Rust.
- Do not implicitly depend on the OS language, system Light / Dark setting, date, time, or file ordering. Fix only the conditions needed for the goal, and compare collections as sets when ordering is not part of the specification.
- Resolve animation or focus issues by waiting for interactability or the relevant state transition. Do not bypass them with unconditional JavaScript clicks or forced state changes.
- Do not assume WebDriver DOM interactions can control OS file dialogs. Distinguish preparing input files from testing the native dialog itself, and state which paths remain unverified.

Reference: [Selenium's guidance on controlling external dependencies](https://www.selenium.dev/documentation/test_practices/encouraged/mock_external_services/).

## 9. Design Helpers and Failure Diagnostics

- Extract helpers around user actions such as `openSettings` or `selectTheme`. Do not build an extensive Page Object hierarchy or generic testing DSL in advance for a small set of clear scenarios.
- Store selectors or functions/getters that locate fresh elements in helpers and Page Objects, rather than previously located elements. Pass sessions explicitly or keep them per instance; do not share them globally.
- Use test names, step-level `t.diagnostic()` messages, and `timeoutMsg` to identify which user action and expected outcome a test is waiting for. Do not separately dump every WebDriver command in bulk.
- Capture screenshots and save HTML only on failure. Do neither during normal execution or on success.
- Whenever a failure screenshot is captured, also save the page HTML alongside it. Screenshots are for human review; agents must inspect the saved HTML to determine the screen state, diagnose failures, and plan fixes instead of interpreting the screenshot.
- On failure, preserve screenshots, HTML, the current URL, relevant values, application/driver logs, and the initialData location where possible. Do not let diagnostic collection or cleanup errors obscure the original failure.
- Do not hide flaky tests through automatic retries or blanket timeout increases. Determine whether the cause is missing preconditions, stale elements, incorrect completion conditions, shared environment state, or a product defect.
- Do not consider a fix complete merely because a rerun passed. Address the cause and verify the affected behavior.

References: [WebdriverIO Page Objects](https://webdriver.io/docs/pageobjects) and [screenshot capture](https://webdriver.io/docs/api/browser/saveScreenshot).

## 10. Verification After Changes

Run the following from the repository root as appropriate for the changes:

```sh
pnpm test:e2e:type-check
pnpm exec eslint "e2e/**/*.ts"
pnpm exec prettier --check "e2e/**/*.ts" e2e/tsconfig.json
pnpm test:e2e
```

- `pnpm test:e2e` performs type checking, builds the frontend and dedicated E2E binary, then runs the scenarios.
- Use `pnpm test:e2e:run` only when the E2E binary and frontend are up to date. Do not report a pass against an old binary as verification of a new change.
- Windows requires compatible WebView2 / Edge WebDriver versions. Linux requires WebKitWebDriver and a display environment. Drivers are resolved from `TAURI_DRIVER` / `TAURI_NATIVE_DRIVER` overrides, then PATH, then prepared tools under `src-backend/target/e2e-tools/` (see `drivers.ts`). Explicit invalid overrides fail instead of falling back. These local tools are not tracked in Git and must be provisioned on a fresh environment. The current manual `tauri-driver` setup does not target macOS.
- Run changed scenarios individually. For changes to initialData, startup, cleanup, or shared helpers, also verify that two concurrent runs do not interfere. If only one scenario exists, do not report one successful run as verification of two concurrent runs.
- When fixing instability, repeat tests as needed to verify the reproduction conditions. Do not add unrelated tests or rerun the entire suite without bounds.
- Documentation-only changes do not require type checking or an E2E rerun. Do not claim that checks passed when they were not run.

Environment reference: [Tauri v2 manual WebDriver setup](https://v2.tauri.app/develop/tests/webdriver/manual-setup/).
