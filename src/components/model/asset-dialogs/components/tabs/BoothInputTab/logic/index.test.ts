import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAndSetAssetInfoFromBoothToForm } from '.'
import { AssetSummary, BoothAssetInfo } from '@/lib/bindings'
import assert from 'node:assert'

const mockAssetSummary: AssetSummary = {
  id: '123',
  name: 'name',
  creator: 'creator',
  assetType: 'Avatar',
  hasMemo: false,
  dependencies: [],
  boothItemId: 123,
  imageFilename: 'imageFilename',
  publishedAt: 123,
}

const mockBoothAssetInfo: BoothAssetInfo = {
  id: 123,
  name: 'name',
  creator: 'creator',
  estimatedAssetType: 'Avatar',
  imageUrls: [
    'https://null-route.konoasset.dev/image1.jpg',
    'https://null-route.konoasset.dev/image2.jpg',
  ],
  publishedAt: 123,
}

vi.mock('@/lib/bindings', async () => {
  return {
    commands: {
      getAssetInfoFromBooth: vi.fn().mockImplementation(async (id: number) => {
        if (id < 0) {
          // Return error if sortBy is Creator for testing purposes
          return {
            status: 'error',
            error: 'error',
          }
        }

        return {
          status: 'ok',
          data: mockBoothAssetInfo,
        }
      }),
      getAssetDisplaysByBoothId: vi
        .fn()
        .mockResolvedValueOnce({ status: 'ok', data: [] })
        .mockImplementationOnce(async () => {
          return { status: 'ok', data: [mockAssetSummary] }
        })
        .mockResolvedValueOnce({ status: 'error', error: 'error' })
        .mockResolvedValue({ status: 'ok', data: [] }),
      resolvePximgFilename: vi
        .fn()
        .mockResolvedValue({ status: 'ok', data: 'imageFilename' }),
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

  it('executes getAndSetAssetInfoFromBoothToForm function successfully', async () => {
    const mockSetImageUrls = vi.fn()

    let result = await getAndSetAssetInfoFromBoothToForm({
      boothItemId: 123,
      setImageUrls: mockSetImageUrls,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(mockForm.setValue).toHaveBeenCalledTimes(6)

    expect(mockForm.setValue.mock.calls[0]).toEqual(['name', 'name'])
    expect(mockForm.setValue.mock.calls[1]).toEqual(['creator', 'creator'])
    expect(mockForm.setValue.mock.calls[2]).toEqual(['publishedAt', 123])
    expect(mockForm.setValue.mock.calls[3]).toEqual(['boothItemId', 123])
    expect(mockForm.setValue.mock.calls[4]).toEqual(['assetType', 'Avatar'])
    expect(mockSetImageUrls).toBeCalledWith([
      'https://null-route.konoasset.dev/image1.jpg',
      'https://null-route.konoasset.dev/image2.jpg',
    ])

    expect(result.status).toBe('ok')
    assert(result.status === 'ok')

    expect(result.data.goNext).toBe(true)

    // Duplicate case
    result = await getAndSetAssetInfoFromBoothToForm({
      boothItemId: 123,
      setImageUrls: mockSetImageUrls,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(result.status).toBe('ok')
    assert(result.status === 'ok')

    expect(result.data.duplicated).toBe(true)

    // Error on duplication check
    result = await getAndSetAssetInfoFromBoothToForm({
      boothItemId: 123,
      setImageUrls: mockSetImageUrls,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(result.status).toBe('error')
  })

  it('executes getAndSetAssetDescriptionFromBoothToForm function correctly on failed to fetch information from Booth', async () => {
    const mockSetImageUrls = vi.fn()

    const result = await getAndSetAssetInfoFromBoothToForm({
      boothItemId: -1,
      setImageUrls: mockSetImageUrls,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(mockForm.setValue).not.toBeCalled()
    expect(mockSetImageUrls).not.toBeCalled()

    expect(result.status).toBe('error')
  })

  it("fallbacks to 'Avatar' if estimatedAssetType is not provided on getAndSetAssetDescriptionFromBoothToForm function", async () => {
    const mockSetImageUrls = vi.fn()

    const result = await getAndSetAssetInfoFromBoothToForm({
      boothItemId: 123,
      setImageUrls: mockSetImageUrls,
      // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
      form: mockForm,
    })

    expect(mockForm.setValue).toHaveBeenCalledTimes(6)
    expect(mockForm.setValue.mock.calls[4]).toEqual(['assetType', 'Avatar'])

    expect(result.status).toBe('ok')
  })
})
