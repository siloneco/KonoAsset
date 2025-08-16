import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SquareImagePathSelector } from '.'

const meta = {
  title: 'square-image/components/SquareImagePathSelector',
  component: SquareImagePathSelector,
  parameters: {
    layout: 'centered',
    screenshot: {
      hover: '[data-testid="square-image-path-selector"]',
    },
  },
  tags: [],
  argTypes: {
    selectUserImage: { action: 'selectUserImage' },
  },
  args: {
    selectUserImage: fn(),
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

export const Default: Story = {}
