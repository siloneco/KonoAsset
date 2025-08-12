import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalMemoDialog } from './'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { fn } from 'storybook/test'

const meta = {
  title: 'memo-dialog/MemoDialog',
  component: InternalMemoDialog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    isOpen: { control: 'boolean' },
    setOpen: { action: 'setOpen' },
    loading: { control: 'boolean' },
    name: { control: 'text' },
    memo: { control: 'text' },
  },
  args: {
    isOpen: true,
    setOpen: fn(),
    loading: false,
    name: 'Example Asset Name',
    memo: 'This is an example memo',
  },
  render: (args) => {
    const [isOpen, setOpen] = useState(args.isOpen)

    const handleSetOpen = useCallback(
      (open: boolean) => {
        setOpen(open)
        args.setOpen(open)
      },
      [args],
    )

    return (
      <>
        <Button onClick={() => handleSetOpen(true)}>Open</Button>
        <InternalMemoDialog {...args} isOpen={isOpen} setOpen={handleSetOpen} />
      </>
    )
  },
} satisfies Meta<typeof InternalMemoDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const WithURL: Story = {
  args: {
    memo: 'This text, https://www.google.com , is a URL',
  },
}

export const HorizontallyLongText: Story = {
  args: {
    memo: 'This is an example memo text. '.repeat(20),
  },
}

export const HorizontallyLongTextWithoutWhiteSpace: Story = {
  name: 'Horizontally Long Text (Without White Space)',
  args: {
    memo: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(20),
  },
}

export const VerticallyLongText: Story = {
  args: {
    memo: 'This is an example memo text. \n'.repeat(20),
  },
}
