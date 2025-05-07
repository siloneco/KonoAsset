import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { refreshAssets } from '.'
import { AssetSummary, commands, SortBy } from '@/lib/bindings'

const mockSortedAssets: AssetSummary[] = [
  {
    id: 'id',
    assetType: 'Avatar',
    name: 'name',
    creator: 'creator',
    boothItemId: null,
    hasMemo: false,
    dependencies: [],
    imageFilename: 'imageFilename',
    publishedAt: 123,
  },
]

vi.mock('@/lib/bindings', async () => {
  return {
    commands: {
      getSortedAssetsForDisplay: vi
        .fn()
        .mockImplementation(async (sortBy: SortBy) => {
          if (sortBy === 'Creator') {
            // Return error if sortBy is Creator for testing purposes
            return {
              status: 'error',
              error: 'error',
            }
          }

          return {
            status: 'ok',
            data: mockSortedAssets,
          }
        }),
    },
  }
})

describe('PersistentContext Logic', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('executes refreshAssets function correctly', async () => {
    const sortBy: SortBy = 'Name'
    const setAssetDisplaySortedList = vi.fn()

    await refreshAssets(sortBy, setAssetDisplaySortedList)

    const mockedCommand = commands.getSortedAssetsForDisplay as Mock

    expect(mockedCommand).toHaveBeenCalledOnce()
    expect(mockedCommand.mock.calls[0][0]).toEqual(sortBy)

    expect(setAssetDisplaySortedList).toHaveBeenCalledOnce()
    expect(setAssetDisplaySortedList.mock.calls[0][0]).toEqual(mockSortedAssets)
  })

  it('skips to refresh when failed to retrieve assets', async () => {
    const sortBy: SortBy = 'Creator'
    const setAssetDisplaySortedList = vi.fn()

    await refreshAssets(sortBy, setAssetDisplaySortedList)

    const mockedCommand = commands.getSortedAssetsForDisplay as Mock

    expect(mockedCommand).toHaveBeenCalledOnce()
    expect(mockedCommand.mock.calls[0][0]).toEqual(sortBy)

    expect(setAssetDisplaySortedList).not.toHaveBeenCalled()
  })
})
