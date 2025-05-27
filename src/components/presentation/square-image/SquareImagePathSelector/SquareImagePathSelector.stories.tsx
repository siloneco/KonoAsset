import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { SquareImagePathSelector } from '.'

const meta = {
  title: 'square-image/Components/SquareImagePathSelector',
  component: SquareImagePathSelector,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    onSelect: { action: 'onSelect' },
  },
  args: {
    onSelect: fn(),
    openPathSelectDialog: fn(),
  },
  decorators: [
    (Story) => (
      <div className="relative size-64 border border-primary">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SquareImagePathSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
