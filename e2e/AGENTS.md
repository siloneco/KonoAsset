# E2E Test Implementation Guidelines

Simulate user actions and verify that users can achieve their goals.
Even if existing tests use patterns that differ from these guidelines, do not treat those patterns as approved practices.

## Structure
- Use TypeScript, `node:test`, WebdriverIO's `remote()`, and `tauri-driver`.
- Write scenarios in `e2e/scenarios/*.test.ts`, one scenario per file.
- Place shared helpers and build infrastructure directly under `e2e/`.

## Scenario Design
- Explicitly state each scenario's preconditions, actions, and observable outcomes.
- Do NOT combine unrelated feature tests into one giant scenario.
- Test broad user workflows. Do NOT implement overly detailed assertions.
- Verify important operations, such as cancellation, recovery from failures, and restarting the app.

Examples:
- Change the theme: light, dark, light, reload (the selected value, actual theme, and saved value match).
- Delete an asset: list, delete, list (only the selected asset disappears, while other assets remain).
- Cancel deletion: list, confirmation dialog, cancel (the dialog closes, and the asset and its original data remain).

## Important Notes
- Write test names in English.
- Do NOT share data between tests except for `initialData`.
- Use `wait*()` to inspect the UI. `assert` may cause immediate failures before the UI has rendered.
- `browser.refresh()` only reloads the frontend. Restart the app to refresh the Rust process.
- Retrieve elements again on every iteration inside `waitUntil`, since previously retrieved elements may become stale.
- When verifying that an element disappears, first confirm that it exists.
- Do NOT conclude that a list is empty solely because its count is `0`. It may still be loading.
- Do NOT create tests that depend on external APIs or actual network speeds.
- Make preconditions deterministic. Design tests to avoid failures caused by environmental differences.
- Extract reusable user actions into helpers.
- Capture screenshots and save HTML only on failure, and prioritize HTML when investigating the cause of a failure.

## Selectors
- Base selectors on information visible to users whenever possible.
- You MAY also use `data-testid`.
- Labels and completion messages MAY use fixed expected values to verify that the app works in Japanese.
- Give icon-only buttons meaningful `aria-label` values and use them in selectors.
- For elements with the same name, scope selectors to the relevant dialog or row. Do NOT resolve ambiguity with `.first()` or array indices.

## Commands
```sh
# Static analysis
pnpm test:e2e:type-check
pnpm exec eslint "e2e/**/*.ts"
pnpm exec prettier --check "e2e/**/*.ts" e2e/tsconfig.json

# Build
pnpm test:e2e:build

# Run all tests
pnpm test:e2e

# Run a specific test file
pnpm exec node --test e2e/scenarios/example.test.ts
```

