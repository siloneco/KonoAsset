import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalDataManagementDialog } from '.'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { fn } from 'storybook/test'
import { SimplifiedDirEntry } from '@/lib/bindings'

const EXAMPLE_ENTRY: SimplifiedDirEntry = {
  entryType: 'file',
  absolutePath: 'example.txt',
  name: 'example.txt',
}

const meta = {
  title: 'data-management-dialog/DataManagementDialog',
  component: InternalDataManagementDialog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    isOpen: { control: 'boolean' },
    setOpen: { action: 'setOpen' },
    id: { control: 'text' },
    entries: { control: 'object' },
    ongoingImports: { control: 'object' },
    refreshEntries: { action: 'refreshEntries' },
    onAddButtonClick: { action: 'onAddButtonClick' },
  },
  args: {
    isOpen: true,
    setOpen: fn(),
    id: '1',
    entries: [EXAMPLE_ENTRY],
    ongoingImports: [],
    refreshEntries: fn(),
    onAddButtonClick: fn(),
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
        <InternalDataManagementDialog
          {...args}
          isOpen={isOpen}
          setOpen={handleSetOpen}
        />
      </>
    )
  },
} satisfies Meta<typeof InternalDataManagementDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
