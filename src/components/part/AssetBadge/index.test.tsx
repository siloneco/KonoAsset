import { setupAndRender as setupUserAndRender } from '@/test/init'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AssetBadge from '.'
import { cleanup, render, screen } from '@testing-library/react'

vi.mock('@/hooks/use-localization', () => {
  return {
    useLocalization: () => ({
      t: (key: string) => key,
    }),
  }
})

describe('AssetBadge', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders correctly for the Avatar type', async () => {
    render(<AssetBadge type="Avatar" />)
    screen.getByText('general:typeavatar')
  })

  it('renders correctly for the AvatarWearable type', async () => {
    render(<AssetBadge type="AvatarWearable" />)
    screen.getByText('general:typeavatarwearable')
  })

  it('renders correctly for the WorldObject type', async () => {
    render(<AssetBadge type="WorldObject" />)
    screen.getByText('general:typeworldobject')
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

    const target = screen.getByText('general:typeavatar')

    await user.click(target)

    expect(onClickMock).toHaveBeenCalledOnce()
  })

  it('applies the className prop', async () => {
    render(<AssetBadge type="Avatar" className="sample-class" />)
    const target = screen.getByText('general:typeavatar')
    expect(target.classList.contains('sample-class')).toBe(true)
  })
})
