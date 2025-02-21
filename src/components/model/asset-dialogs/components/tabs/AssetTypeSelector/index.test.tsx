import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import AssetTypeSelectorTab from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'

describe('AssetTypeSelector', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('handles button clicks correctly', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    render(
      <Dialog open={true}>
        <DialogContent>
          <AssetTypeSelectorTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    // Check back button works correctly
    fireEvent.click(screen.getByText('戻る'))
    expect(mockSetTab).toHaveBeenCalledTimes(1)
    expect(mockSetTab.mock.calls[0][0]).toBe('booth-input')

    // Check next button works correctly
    fireEvent.click(screen.getByText('次へ'))
    expect(mockSetTab).toHaveBeenCalledTimes(2)
    expect(mockSetTab.mock.calls[1][0]).toBe('manual-input')

    // Check asset type buttons work correctly
    fireEvent.click(screen.getByText('アバター素体'))
    expect(mockForm.setValue).toHaveBeenCalledTimes(1)
    expect(mockForm.setValue.mock.calls[0][0]).toBe('assetType')
    expect(mockForm.setValue.mock.calls[0][1]).toBe('Avatar')

    fireEvent.click(
      screen.getByText('アバター関連 (服 / 髪 / アクセサリ / ギミック等)'),
    )
    expect(mockForm.setValue).toHaveBeenCalledTimes(2)
    expect(mockForm.setValue.mock.calls[1][0]).toBe('assetType')
    expect(mockForm.setValue.mock.calls[1][1]).toBe('AvatarWearable')

    fireEvent.click(screen.getByText('ワールドアセット'))
    expect(mockForm.setValue).toHaveBeenCalledTimes(3)
    expect(mockForm.setValue.mock.calls[2][0]).toBe('assetType')
    expect(mockForm.setValue.mock.calls[2][1]).toBe('WorldObject')
  })

  it('renders border on Avatar when it has been selected', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('Avatar'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    render(
      <Dialog open={true}>
        <DialogContent>
          <AssetTypeSelectorTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    // Check Avatar button has border
    const avatar = screen.getByText('アバター素体')
    expect(avatar.classList).toContain('border-primary')
    expect(avatar.classList).toContain('border-2')

    // Check other buttons do not have border
    const avatarWearable = screen.getByText(
      'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
    )
    expect(avatarWearable.classList).not.toContain('border-primary')
    expect(avatarWearable.classList).not.toContain('border-2')

    const worldObject = screen.getByText('ワールドアセット')
    expect(worldObject.classList).not.toContain('border-primary')
    expect(worldObject.classList).not.toContain('border-2')
  })

  it('renders border on AvatarWearable when it has been selected', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('AvatarWearable'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    render(
      <Dialog open={true}>
        <DialogContent>
          <AssetTypeSelectorTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    // Check AvatarWearable button has border
    const avatarWearable = screen.getByText(
      'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
    )
    expect(avatarWearable.classList).toContain('border-primary')
    expect(avatarWearable.classList).toContain('border-2')

    // Check other buttons do not have border
    const avatar = screen.getByText('アバター素体')
    expect(avatar.classList).not.toContain('border-primary')
    expect(avatar.classList).not.toContain('border-2')

    const worldObject = screen.getByText('ワールドアセット')
    expect(worldObject.classList).not.toContain('border-primary')
    expect(worldObject.classList).not.toContain('border-2')
  })

  it('renders border on WorldObject when it has been selected', async () => {
    const mockForm = {
      watch: vi.fn().mockReturnValue('WorldObject'),
      setValue: vi.fn(),
    }
    const mockSetTab = vi.fn()

    render(
      <Dialog open={true}>
        <DialogContent>
          <AssetTypeSelectorTab
            // @ts-expect-error type check fails but it satisfies the required fields
            form={mockForm}
            setTab={mockSetTab}
          />
        </DialogContent>
      </Dialog>,
    )

    // Check WorldObject button has border
    const worldObject = screen.getByText('ワールドアセット')
    expect(worldObject.classList).toContain('border-primary')
    expect(worldObject.classList).toContain('border-2')

    // Check other buttons do not have border
    const avatar = screen.getByText('アバター素体')
    expect(avatar.classList).not.toContain('border-primary')
    expect(avatar.classList).not.toContain('border-2')

    const avatarWearable = screen.getByText(
      'アバター関連 (服 / 髪 / アクセサリ / ギミック等)',
    )
    expect(avatarWearable.classList).not.toContain('border-primary')
    expect(avatarWearable.classList).not.toContain('border-2')
  })
})
