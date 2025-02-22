import { describe, expect, it } from 'vitest'
import { usePersistentContext } from '.'
import { act, renderHook } from '@testing-library/react'

describe('PersistentContext Hook', () => {
  it('executes usePersistentContext function correctly', async () => {
    const { result } = renderHook(() => usePersistentContext())

    // Test setSortBy works correctly
    const sortBy = 'Creator'
    expect(result.current.persistentContextValue.sortBy).not.toEqual(sortBy)
    act(() => result.current.persistentContextValue.setSortBy(sortBy))
    expect(result.current.persistentContextValue.sortBy).toEqual(sortBy)

    // Test setReverseOrder works correctly
    const reverseOrder = !result.current.persistentContextValue.reverseOrder
    expect(result.current.persistentContextValue.reverseOrder).not.toEqual(
      reverseOrder,
    )
    act(() =>
      result.current.persistentContextValue.setReverseOrder(reverseOrder),
    )
    expect(result.current.persistentContextValue.reverseOrder).toEqual(
      reverseOrder,
    )

    // Test textFilter works correctly
    const textFilter = 'test'
    expect(result.current.persistentContextValue.textFilter).not.toEqual(
      textFilter,
    )
    act(() => result.current.persistentContextValue.setTextFilter(textFilter))
    expect(result.current.persistentContextValue.textFilter).toEqual(textFilter)

    // Test setAssetType works correctly
    const assetType = 'Avatar'
    expect(result.current.persistentContextValue.assetType).not.toEqual(
      assetType,
    )
    act(() => result.current.persistentContextValue.setAssetType(assetType))
    expect(result.current.persistentContextValue.assetType).toEqual(assetType)

    // Test setCategoryFilter works correctly
    const categoryFilter = ['test']
    expect(result.current.persistentContextValue.categoryFilter).not.toEqual(
      categoryFilter,
    )
    act(() =>
      result.current.persistentContextValue.setCategoryFilter(categoryFilter),
    )
    expect(result.current.persistentContextValue.categoryFilter).toEqual(
      categoryFilter,
    )

    // Test setTagFilter works correctly
    const tagFilter = ['test']
    expect(result.current.persistentContextValue.tagFilter).not.toEqual(
      tagFilter,
    )
    act(() => result.current.persistentContextValue.setTagFilter(tagFilter))
    expect(result.current.persistentContextValue.tagFilter).toEqual(tagFilter)

    // Test setTagFilterMatchType works correctly
    const tagFilterMatchType = 'AND'
    expect(
      result.current.persistentContextValue.tagFilterMatchType,
    ).not.toEqual(tagFilterMatchType)
    act(() =>
      result.current.persistentContextValue.setTagFilterMatchType(
        tagFilterMatchType,
      ),
    )
    expect(result.current.persistentContextValue.tagFilterMatchType).toEqual(
      tagFilterMatchType,
    )

    // Test setSupportedAvatarFilter works correctly
    const supportedAvatarFilter = ['test']
    expect(
      result.current.persistentContextValue.supportedAvatarFilter,
    ).not.toEqual(supportedAvatarFilter)
    act(() =>
      result.current.persistentContextValue.setSupportedAvatarFilter(
        supportedAvatarFilter,
      ),
    )
    expect(result.current.persistentContextValue.supportedAvatarFilter).toEqual(
      supportedAvatarFilter,
    )

    // Test clearFilters works correctly
    act(() => result.current.persistentContextValue.clearFilters())
    expect(result.current.persistentContextValue.textFilter).toEqual('')
    expect(result.current.persistentContextValue.assetType).toEqual('All')
    expect(result.current.persistentContextValue.categoryFilter).toEqual([])
    expect(result.current.persistentContextValue.tagFilter).toEqual([])
    expect(result.current.persistentContextValue.supportedAvatarFilter).toEqual(
      [],
    )
  })
})
