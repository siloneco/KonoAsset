import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { getAndSetAssetDescriptionFromBoothToForm } from '.'
import { BoothInfo, commands } from '@/lib/bindings'
import assert from 'node:assert'

const mockBoothInfo: BoothInfo = {
  estimatedAssetType: 'Avatar',
  description: {
    name: 'name',
    creator: 'creator',
    imageFilename: 'imageFilename',
    publishedAt: 123,
    boothItemId: 123,
    createdAt: 123,
    tags: [],
  },
}

vi.mock('@/lib/bindings', async () => {
  return {
    commands: {
      getAssetDescriptionFromBooth: vi
        .fn()
        .mockImplementation(async (id: number) => {
          if (id < 0) {
            // Return error if sortBy is Creator for testing purposes
            return {
              status: 'error',
              error: 'error',
            }
          }

          return {
            status: 'ok',
            data: mockBoothInfo,
          }
        }),
      getAssetDisplaysByBoothId: vi
        .fn()
        .mockResolvedValueOnce({ status: 'ok', data: [] })
        .mockImplementationOnce(async () => {
          return { status: 'ok', data: [mockBoothInfo] }
        })
        .mockResolvedValueOnce({ status: 'error', error: 'error' })
        .mockImplementationOnce(async () => {
          return { ...mockBoothInfo, estimatedAssetType: null }
        }),
    },
  }
})

const mockForm = {
  setValue: vi.fn(),
}

describe('BoothInputTab Logic', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('executes getAndSetAssetDescriptionFromBoothToForm function successfully', async () => {
    let result = await getAndSetAssetDescriptionFromBoothToForm({
      boothItemId: 123,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(mockForm.setValue).toHaveBeenCalledTimes(6)

    expect(mockForm.setValue.mock.calls[0]).toEqual(['name', 'name'])
    expect(mockForm.setValue.mock.calls[1]).toEqual(['creator', 'creator'])
    expect(mockForm.setValue.mock.calls[2]).toEqual([
      'imageFilename',
      'imageFilename',
    ])
    expect(mockForm.setValue.mock.calls[3]).toEqual(['publishedAt', 123])
    expect(mockForm.setValue.mock.calls[4]).toEqual(['boothItemId', 123])
    expect(mockForm.setValue.mock.calls[5]).toEqual(['assetType', 'Avatar'])

    expect(result.status).toBe('ok')
    assert(result.status === 'ok')

    expect(result.data.goNext).toBe(true)

    // Duplicate case
    result = await getAndSetAssetDescriptionFromBoothToForm({
      boothItemId: 123,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(result.status).toBe('ok')
    assert(result.status === 'ok')

    expect(result.data.duplicated).toBe(true)

    // Error on duplication check
    result = await getAndSetAssetDescriptionFromBoothToForm({
      boothItemId: 123,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(result.status).toBe('error')
  })

  it('executes getAndSetAssetDescriptionFromBoothToForm function correctly on failed to fetch information from Booth', async () => {
    const result = await getAndSetAssetDescriptionFromBoothToForm({
      boothItemId: -1,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(mockForm.setValue).not.toBeCalled()

    expect(result.status).toBe('error')
  })

  it("fallbacks to 'Avatar' if estimatedAssetType is not provided on getAndSetAssetDescriptionFromBoothToForm function", async () => {
    const result = await getAndSetAssetDescriptionFromBoothToForm({
      boothItemId: 123,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    const mockedCommand = commands.getAssetDisplaysByBoothId as Mock
    const mockedCommandReturned = await mockedCommand.mock.results[0].value

    expect(mockedCommandReturned.estimatedAssetType).toBe(null)

    expect(mockForm.setValue).toHaveBeenCalledTimes(6)
    expect(mockForm.setValue.mock.calls[5]).toEqual(['assetType', 'Avatar'])

    expect(result.status).toBe('ok')
  })
})
