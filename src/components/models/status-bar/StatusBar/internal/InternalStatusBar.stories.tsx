import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalStatusBar } from '.'
import { fn } from 'storybook/test'

const meta = {
  title: 'status-bar/StatusBar',
  component: InternalStatusBar,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    totalAssetCount: { control: 'number' },
    filterAppliedAssetCount: { control: 'number' },
    clearFilters: { action: 'clearFilters' },
  },
  args: {
    totalAssetCount: 1234,
    filterAppliedAssetCount: 123,
    clearFilters: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByTestId('status-bar-option-popover-trigger')
    await userEvent.click(button)
  },
} satisfies Meta<typeof InternalStatusBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DisplayAll: Story = {
  args: {
    filterAppliedAssetCount: 1234,
  },
}
