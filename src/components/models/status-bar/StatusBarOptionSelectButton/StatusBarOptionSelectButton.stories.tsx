import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBarOptionSelectButton } from '.'
import { useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  title: 'status-bar/components/StatusBarOptionSelectButton',
  component: StatusBarOptionSelectButton,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    children: { control: 'text' },
    current: { control: 'text' },
    value: { control: 'text' },
    setter: { action: 'setter' },
  },
  args: {
    children: 'Click Me',
    current: 'current',
    value: 'value',
    setter: fn(),
  },
  render: (args) => {
    const [current, setCurrent] = useState(args.current)

    return (
      <StatusBarOptionSelectButton
        {...args}
        current={current}
        setter={setCurrent}
      />
    )
  },
} satisfies Meta<typeof StatusBarOptionSelectButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    current: 'value',
    value: 'value',
  },
  parameters: {
    screenshot: {
      variants: {
        hover: {
          hover: '[data-slot="button"]',
        },
      },
    },
  },
}
