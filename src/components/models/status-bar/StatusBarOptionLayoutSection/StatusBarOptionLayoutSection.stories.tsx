import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBarOptionLayoutSection } from '.'
import { useCallback, useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  title: 'status-bar/components/StatusBarOptionLayoutSection',
  component: StatusBarOptionLayoutSection,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    value: { control: 'text' },
    setValue: { action: 'setValue' },
  },
  args: {
    value: 'GridLarge',
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
      <StatusBarOptionLayoutSection value={value} setValue={wrappedSetValue} />
    )
  },
} satisfies Meta<typeof StatusBarOptionLayoutSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
