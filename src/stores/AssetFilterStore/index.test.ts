import { beforeEach, describe, expect, it, vi } from 'vitest'
import { commands } from '@/lib/bindings'
import { useAssetFilterStore } from '.'
import { DEFAULT_FILTERS } from './index.constants'

vi.mock('@/lib/bindings', () => ({
  commands: { getFilteredAssetIds: vi.fn() },
}))

type Result = { status: 'ok'; data: string[] }

// 解決のタイミングをテスト側から制御できる Promise
const deferred = () => {
  let resolve!: (value: Result) => void
  const promise = new Promise<Result>((r) => (resolve = r))
  return { promise, resolve }
}

describe('AssetFilterStore', () => {
  beforeEach(() => {
    useAssetFilterStore.setState({
      filters: DEFAULT_FILTERS,
      filteredIds: null,
    })
    vi.mocked(commands.getFilteredAssetIds).mockReset()
  })

  it('ignores a late result after the filters were cleared', async () => {
    const pending = deferred()
    vi.mocked(commands.getFilteredAssetIds).mockReturnValue(
      pending.promise as never,
    )

    useAssetFilterStore.getState().updateFilter({ text: { generalQuery: 'a' } })
    useAssetFilterStore.getState().clearFilters()

    pending.resolve({ status: 'ok', data: ['stale'] })
    await pending.promise
    await Promise.resolve()

    expect(useAssetFilterStore.getState().filteredIds).toBeNull()
  })

  it('keeps the result of the latest filter when responses arrive out of order', async () => {
    const first = deferred()
    const second = deferred()
    vi.mocked(commands.getFilteredAssetIds)
      .mockReturnValueOnce(first.promise as never)
      .mockReturnValueOnce(second.promise as never)

    useAssetFilterStore.getState().updateFilter({ text: { generalQuery: 'a' } })
    useAssetFilterStore
      .getState()
      .updateFilter({ text: { generalQuery: 'ab' } })

    second.resolve({ status: 'ok', data: ['latest'] })
    await second.promise
    await Promise.resolve()
    first.resolve({ status: 'ok', data: ['stale'] })
    await first.promise
    await Promise.resolve()

    expect(useAssetFilterStore.getState().filteredIds).toEqual(['latest'])
  })
})
