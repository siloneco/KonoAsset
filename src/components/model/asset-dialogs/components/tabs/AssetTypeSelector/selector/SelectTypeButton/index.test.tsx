import { setupAndRender } from '@/test/init'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { SelectTypeButton } from '.'

describe('SelectTypeButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders correctly on selected', async () => {
    const text = 'text'
    const onClick = () => {}
    const selected = true

    render(
      <SelectTypeButton text={text} onClick={onClick} selected={selected} />,
    )
    const target = screen.getByText(text)

    expect(target.classList.contains('border-ring')).toBe(true)
    expect(target.classList.contains('border-2')).toBe(true)
    expect(target.querySelector('.lucide-chevrons-right')).not.toBeNull()
  })

  it('renders correctly on not selected', async () => {
    const text = 'text'
    const onClick = () => {}
    const selected = false

    render(
      <SelectTypeButton text={text} onClick={onClick} selected={selected} />,
    )
    const target = screen.getByText(text)

    expect(target.classList.contains('border-primary')).toBe(false)
    expect(target.classList.contains('border-2')).toBe(false)
  })

  it('trigger onClick when clicked', async () => {
    const text = 'text'
    const onClick = vi.fn()
    const selected = false

    const { user } = setupAndRender(
      <SelectTypeButton text={text} onClick={onClick} selected={selected} />,
    )
    const target = screen.getByText(text)

    await user.click(target)

    expect(onClick).toHaveBeenCalledOnce()
  })
})
