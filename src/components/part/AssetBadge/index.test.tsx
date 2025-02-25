import { setupAndRender as setupUserAndRender } from '@/test/init'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AssetBadge from '.'
import { cleanup, render, screen } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

describe('AssetBadge', () => {
  it('renders correctly for the Avatar type', async () => {
    render(<AssetBadge type="Avatar" />)
    screen.getByText('アバター素体')
  })

  it('renders correctly for the AvatarWearable type', async () => {
    render(<AssetBadge type="AvatarWearable" />)
    screen.getByText('アバター関連')
  })

  it('renders correctly for the WorldObject type', async () => {
    render(<AssetBadge type="WorldObject" />)
    screen.getByText('ワールドアセット')
  })

  it('renders correctly for the Unknown type', async () => {
    // @ts-expect-error Testing for an unknown type
    render(<AssetBadge type="Unknown" />)
    screen.getByText('Unknown')
  })

  it('calls onClick', async () => {
    const onClickMock = vi.fn()
    const { user } = setupUserAndRender(
      <AssetBadge type="Avatar" onClick={onClickMock} />,
    )

    const target = screen.getByText('アバター素体')

    await user.click(target)

    expect(onClickMock).toHaveBeenCalledOnce()
  })

  it('applies the className prop', async () => {
    render(<AssetBadge type="Avatar" className="sample-class" />)
    const target = screen.getByText('アバター素体')
    expect(target.classList.contains('sample-class')).toBe(true)
  })
})
