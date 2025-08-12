import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBarOptionSortSection } from '.'
import { useCallback, useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  title: 'status-bar/components/StatusBarOptionSortSection',
  component: StatusBarOptionSortSection,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    value: { control: 'text' },
    setValue: { action: 'setValue' },
  },
  args: {
    value: 'CreatedAtDesc',
    setValue: fn(),
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)

    const wrappedSetValue = useCallback(
      (value: string) => {
        setValue(value)
        args.setValue(value)
      },
      [args],
    )

    return (
      <StatusBarOptionSortSection value={value} setValue={wrappedSetValue} />
    )
  },
} satisfies Meta<typeof StatusBarOptionSortSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
