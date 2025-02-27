import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { getPreferences } from '.'
import { commands, PreferenceStore } from '@/lib/bindings'

import * as utils from '@/lib/utils'

const mockPreference: PreferenceStore = {
  dataDirPath: '/path/to/data/dir',
  theme: 'system',
  useUnitypackageSelectedOpen: true,
  deleteOnImport: true,
  updateChannel: 'Stable',
  language: 'enUs',
}

vi.mock('@/lib/bindings', async () => {
  return {
    commands: {
      getPreferences: vi
        .fn()
        .mockImplementationOnce(async () => {
          return { status: 'ok', data: mockPreference }
        })
        .mockImplementationOnce(async () => {
          return { status: 'error', error: 'error' }
        }),
    },
  }
})

describe('PreferenceContext Logic', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('executes getPreferences function correctly', async () => {
    // Success case
    const result1 = await getPreferences()

    const mockedCommand = commands.getPreferences as Mock

    expect(mockedCommand).toHaveBeenCalledTimes(1)
    expect(result1).toEqual(mockPreference)

    // Error case
    vi.spyOn(utils, 'getDefaultPreferences')
    const result2 = await getPreferences()

    expect(mockedCommand).toHaveBeenCalledTimes(2)
    expect(utils.getDefaultPreferences).toHaveBeenCalledOnce()
    expect(result2).toEqual(utils.getDefaultPreferences())
  })
})
