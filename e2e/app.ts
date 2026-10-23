import { spawn, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'
import { access, mkdir, mkdtemp, open, readFile, rm } from 'node:fs/promises'
import type { FileHandle } from 'node:fs/promises'
import { createServer } from 'node:net'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import type { TestContext } from 'node:test'
import { remote } from 'webdriverio'
import type { PreferenceStore } from '../src/lib/bindings.ts'

type VersionedPreference = {
  version: 6
  data: PreferenceStore
}

type TauriCapabilities = Parameters<typeof remote>[0]['capabilities'] & {
  'tauri:options': { application: string }
}

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const executable = process.platform === 'win32' ? 'konoasset.exe' : 'konoasset'
const application = path.join(
  projectRoot,
  'src-backend/target/e2e/debug',
  executable,
)

// Reserve both ports together so the native driver cannot get the proxy port.
async function driverPorts() {
  const servers = [createServer(), createServer()]
  try {
    for (const server of servers) {
      server.listen(0, '127.0.0.1')
      await once(server, 'listening')
    }
    return servers.map((server) => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        throw new Error('WebDriver port was not assigned')
      }
      return address.port
    })
  } finally {
    await Promise.all(
      servers.map(
        (server) =>
          new Promise<void>((resolve) => server.close(() => resolve())),
      ),
    )
  }
}

/** Start a fresh real application and WebDriver session for each test. */
export async function startApp(t: TestContext) {
  if (!['win32', 'linux'].includes(process.platform)) {
    throw new Error('tauri-driver E2E supports Windows and Linux only')
  }
  await access(application).catch(() => {
    throw new Error('E2E binary is missing. Run pnpm test:e2e:build first.')
  })

  const runsDir = path.join(projectRoot, 'src-backend/target/e2e-runs')
  await mkdir(runsDir, { recursive: true })
  const root = await mkdtemp(path.join(runsDir, 'test-'))
  const preferencePath = path.join(root, 'app/preference.json')
  const resources: {
    browser?: Awaited<ReturnType<typeof remote>>
    driver?: ChildProcess
    driverLog?: FileHandle
  } = {}
  let driverError: Error | undefined
  // Node.js 24 exposes this at runtime, but @types/node does not declare it yet.
  const hasFailed = () => 'error' in t && Boolean(t.error)

  // Register before startup: a failed session must also release its processes.
  t.after(async () => {
    const { browser, driver, driverLog } = resources
    try {
      if (hasFailed() && browser) {
        await browser
          .saveScreenshot(path.join(root, 'failure.png'))
          .catch(() => {})
        await readFile(preferencePath, 'utf8').then((data) =>
          t.diagnostic(`Preferences at failure: ${data}`),
        )
      }
    } finally {
      try {
        await browser?.deleteSession()
      } finally {
        if (
          driver?.pid &&
          driver.exitCode === null &&
          driver.signalCode === null
        ) {
          const exited = once(driver, 'exit')
          // tauri-driver uses a Windows Job Object to kill its descendants.
          if (process.platform === 'win32') driver.kill()
          else process.kill(-driver.pid, 'SIGTERM')
          await exited
        }
        await driverLog?.close()
        if (hasFailed()) t.diagnostic(`E2E artifacts: ${root}`)
        else
          await rm(root, {
            recursive: true,
            force: true,
            maxRetries: 10,
            retryDelay: 200,
          })
      }
    }
  })

  await mkdir(path.dirname(preferencePath), { recursive: true })
  // VersionedPreferences v6. Existing preferences skip the setup page.
  const preference: VersionedPreference = {
    version: 6,
    data: {
      dataDirPath: path.join(root, 'assets'),
      theme: 'light',
      language: 'ja-JP',
      deleteOnImport: false,
      zipExtraction: true,
      useUnitypackageSelectedOpen: true,
      useTrashBin: true,
      updateChannel: 'Stable',
    },
  }
  const preferenceFile = await open(preferencePath, 'w')
  try {
    await preferenceFile.writeFile(JSON.stringify(preference, null, 2))
  } finally {
    await preferenceFile.close()
  }

  const [port, nativePort] = await driverPorts()
  const args = ['--port', String(port), '--native-port', String(nativePort)]
  if (process.env.TAURI_NATIVE_DRIVER) {
    args.push('--native-driver', process.env.TAURI_NATIVE_DRIVER)
  }
  const driverLog = await open(path.join(root, 'webdriver.log'), 'w')
  resources.driverLog = driverLog
  const driver = spawn(process.env.TAURI_DRIVER ?? 'tauri-driver', args, {
    cwd: projectRoot,
    env: { ...process.env, E2E_ROOT: root },
    stdio: ['ignore', driverLog.fd, driverLog.fd],
    windowsHide: true,
    detached: process.platform !== 'win32',
  })
  resources.driver = driver
  driver.on('error', (error) => {
    driverError = error
  })

  const deadline = Date.now() + 15_000
  while (true) {
    if (driverError) throw driverError
    if (driver.exitCode !== null || driver.signalCode !== null) {
      throw new Error(
        `tauri-driver exited: ${await readFile(path.join(root, 'webdriver.log'), 'utf8')}`,
      )
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/status`, {
        signal: AbortSignal.timeout(1000),
      })
      const status = (await response.json()) as { value: { ready: boolean } }
      if (response.ok && status.value.ready) break
    } catch {
      /* The native driver may still be starting. */
    }
    if (Date.now() > deadline)
      throw new Error('tauri-driver did not become ready')
    await setTimeout(100)
  }

  const capabilities: TauriCapabilities = { 'tauri:options': { application } }
  const browser = await remote({
    hostname: '127.0.0.1',
    port,
    logLevel: 'warn',
    connectionRetryCount: 0,
    connectionRetryTimeout: 30_000,
    waitforTimeout: 10_000,
    capabilities,
  })
  resources.browser = browser
  return {
    browser,
    root,
    readPreference: async () =>
      (
        JSON.parse(
          await readFile(preferencePath, 'utf8'),
        ) as VersionedPreference
      ).data,
  }
}
