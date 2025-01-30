import { describe, expect, it, vi } from 'vitest'
import { truncateFilename } from '.'

vi.mock('@tauri-apps/api/path', () => {
  return {
    sep: vi.fn().mockReturnValue('\\'),
  }
})

describe('ProgressTab Logic', () => {
  it('truncates filename correctly', async () => {
    expect(truncateFilename('C:\\short\\path\\text.txt')).toBe(
      'C:\\short\\path\\text.txt',
    )

    expect(
      truncateFilename(
        'C:\\Users\\username\\Documents\\KonoAsset\\data\\something\\text.txt',
      ),
    ).toBe('C:\\Users\\username\\Documents\\KonoAsset\\ ... \\text.txt')
  })
})
