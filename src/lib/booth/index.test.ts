import { describe, expect, it } from 'vitest'
import { convertToBoothURL, extractBoothItemId, isBoothURL } from '.'

describe.concurrent('utils', () => {
  it('executes isBoothURL correctly', () => {
    // 正常
    expect(isBoothURL('https://booth.pm/ja/items/123')).toBe(true)
    expect(isBoothURL('https://booth.pm/ja/items/987654')).toBe(true)
    expect(isBoothURL('https://booth.pm/en/items/123')).toBe(true)
    expect(isBoothURL('https://booth.pm/en/items/987654')).toBe(true)
    expect(isBoothURL('https://example.booth.pm/items/123')).toBe(true)
    expect(isBoothURL('https://example-shop-name.booth.pm/items/1000')).toBe(
      true,
    )

    // 異常
    expect(isBoothURL('https://booth.pm/ja/items/abcdefg')).toBe(false)
    expect(isBoothURL('https://example.booth.pm/items/abcdefg')).toBe(false)
    expect(isBoothURL('https://example.com/ja/items/123')).toBe(false)
    expect(isBoothURL('https://other.example.com/items/123')).toBe(false)
    expect(isBoothURL('https://booth.pm/long-language-code/items/123')).toBe(
      false,
    )
  })

  it('executes extractBoothItemId correctly', () => {
    // 正常
    expect(extractBoothItemId('https://booth.pm/ja/items/123')).toEqual({
      status: 'ok',
      data: 123,
    })
    expect(extractBoothItemId('https://example.booth.pm/items/123')).toEqual({
      status: 'ok',
      data: 123,
    })

    // 異常
    expect(extractBoothItemId('https://booth.pm/ja/items/abcdefg')).toEqual({
      status: 'error',
      error: 'Invalid Booth URL specified',
    })
    expect(extractBoothItemId('https://example.com/ja/items/123')).toEqual({
      status: 'error',
      error: 'Invalid Booth URL specified',
    })
  })

  it('executes convertToBoothURL correctly', () => {
    // 正常
    expect(convertToBoothURL(123, 'ja-JP')).toBe(
      'https://booth.pm/ja/items/123',
    )
    expect(convertToBoothURL(987654, 'ja-JP')).toBe(
      'https://booth.pm/ja/items/987654',
    )
    expect(convertToBoothURL(1000, 'ja-JP')).toBe(
      'https://booth.pm/ja/items/1000',
    )
  })
})
