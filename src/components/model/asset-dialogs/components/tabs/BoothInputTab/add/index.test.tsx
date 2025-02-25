import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import BoothInputTab from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useBoothInputTabForAddDialog } from './hook'
import { setupAndRender } from '@/test/init'

vi.mock('./hook', () => {
  return {
    useBoothInputTabForAddDialog: vi.fn(),
  }
})

vi.mock('@/hooks/use-localization', () => {
  return {
    useLocalization: () => ({
      t: (key: string) => key,
    }),
  }
})

describe('BoothInputTab', () => {
  const getAssetDescriptionFromBooth = vi.fn()
  const onUrlInputChange = vi.fn()
  const moveToNextTab = vi.fn()
  const backToPreviousTab = vi.fn()

  const base = {
    representativeImportFilename: 'test',
    importFileCount: 1,
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching: false,
    boothUrlInput: '',
    moveToNextTab,
    backToPreviousTab,
  }

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('handles button clicks and keyboard input correctly', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    const mockUseBoothInputTab = useBoothInputTabForAddDialog as Mock
    mockUseBoothInputTab.mockReturnValueOnce(base)

    const { user } = setupAndRender(
      <Dialog open={true}>
        <DialogContent>
          <BoothInputTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    const { backToPreviousTab, moveToNextTab, onUrlInputChange } = base

    // Check back button works correctly
    fireEvent.click(screen.getByText('general:button:back'))
    expect(backToPreviousTab).toHaveBeenCalledOnce()

    // Check skip button works correctly
    fireEvent.click(screen.getByText('addasset:booth-input:manual-input'))
    expect(moveToNextTab).toHaveBeenCalledOnce()

    const inputTarget = screen.getByPlaceholderText(
      'https://booth.pm/ja/items/1234567',
    )

    // Check input change works correctly
    const inputText = 'https://booth.pm/ja/items/1234567'
    await user.type(inputTarget, inputText)

    expect(onUrlInputChange).toHaveBeenCalledTimes(inputText.length)
    expect(
      onUrlInputChange.mock.calls[inputText.length - 1][0].target.value,
    ).toEqual(inputText)
  })

  it('renders fetch button as disabled when URL is invalid', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    const mockUseBoothInputTab = useBoothInputTabForAddDialog as Mock
    mockUseBoothInputTab.mockReturnValueOnce(base)

    render(
      <Dialog open={true}>
        <DialogContent>
          <BoothInputTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    expect(
      screen
        .getByText('addasset:booth-input:button-text')
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  it('renders fetch button as enabled when URL is valid', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    const mockUseBoothInputTab = useBoothInputTabForAddDialog as Mock
    mockUseBoothInputTab.mockReturnValueOnce({
      ...base,
      boothUrlInput: 'https://booth.pm/ja/items/1234567',
    })

    render(
      <Dialog open={true}>
        <DialogContent>
          <BoothInputTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    expect(
      screen
        .getByText('addasset:booth-input:button-text')
        .hasAttribute('disabled'),
    ).toBe(false)
  })

  it('renders fetch button as disabled and shows spinner while fetching', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    const mockUseBoothInputTab = useBoothInputTabForAddDialog as Mock
    mockUseBoothInputTab.mockReturnValueOnce({
      ...base,
      fetching: true,
    })

    render(
      <Dialog open={true}>
        <DialogContent>
          <BoothInputTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    const fetchButton = screen.getByText('addasset:booth-input:button-text')

    // Check button is disabled while fetching
    expect(fetchButton.hasAttribute('disabled')).toBe(true)

    // Check spinner is shown while fetching
    const spinner = fetchButton.querySelector('.lucide-loader-circle')
    expect(spinner).not.toBeNull()

    // Check spinner is animated
    expect(spinner!.classList).toContain('animate-spin')
  })

  it('renders representative file name', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    const representativeImportFilename = 'test filename'

    const mockUseBoothInputTab = useBoothInputTabForAddDialog as Mock
    mockUseBoothInputTab.mockReturnValueOnce({
      ...base,
      representativeImportFilename,
    })

    render(
      <Dialog open={true}>
        <DialogContent>
          <BoothInputTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    expect(screen.getByText(representativeImportFilename)).not.toBeNull()
  })

  it('renders amount of importing files', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    const importFileCount = 3

    const mockUseBoothInputTab = useBoothInputTabForAddDialog as Mock
    mockUseBoothInputTab.mockReturnValueOnce({
      ...base,
      importFileCount,
    })

    render(
      <Dialog open={true}>
        <DialogContent>
          <BoothInputTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    expect(
      screen.getByText(
        `addasset:booth-input:multi-import:foretext${importFileCount - 1}addasset:booth-input:multi-import:posttext`,
      ),
    ).not.toBeNull()
  })
})
