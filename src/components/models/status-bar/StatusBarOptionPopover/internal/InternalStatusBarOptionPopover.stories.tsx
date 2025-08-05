import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalStatusBarOptionPopover } from '.'
import { useCallback, useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  title: 'status-bar/components/StatusBarOptionPopover',
  component: InternalStatusBarOptionPopover,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    displayLayoutValue: { control: 'text' },
    sortValue: { control: 'text' },
    setSort: { action: 'setSort' },
    setDisplayLayout: { action: 'setDisplayLayout' },
  },
  args: {
    displayLayoutValue: 'GridLarge',
    sortValue: 'CreatedAtDesc',
    setSort: fn(),
    setDisplayLayout: fn(),
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
  render: (args) => {
    const [displayLayoutValue, setDisplayLayoutValue] = useState(
      args.displayLayoutValue,
    )
    const [sortValue, setSortValue] = useState(args.sortValue)

    const wrappedSetDisplayLayout = useCallback(
      (value: string) => {
        setDisplayLayoutValue(value)
        args.setDisplayLayout(value)
      },
      [args],
    )

    const wrappedSetSort = useCallback(
      (value: string) => {
        setSortValue(value)
        args.setSort(value)
      },
      [args],
    )

    return (
      <InternalStatusBarOptionPopover
        displayLayoutValue={displayLayoutValue}
        sortValue={sortValue}
        setSort={wrappedSetSort}
        setDisplayLayout={wrappedSetDisplayLayout}
      />
    )
  },
  decorators: [
    (Story) => (
      <div className="h-[calc(100vh-2rem)] pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InternalStatusBarOptionPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
