import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalDependencyDialog } from '.'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { fn } from 'storybook/test'
import { AssetSummary } from '@/lib/bindings'

const EXAMPLE_DEPENDENCIES: AssetSummary = {
  id: '1',
  assetType: 'Avatar',
  name: 'Example Asset 1',
  creator: 'Example Creator',
  imageFilename: null,
  hasMemo: false,
  boothItemId: 6641548,
  dependencies: [],
  publishedAt: 0,
}

const meta = {
  title: 'dependency-dialog/DependencyDialog',
  component: InternalDependencyDialog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    isOpen: { control: 'boolean' },
    setOpen: { action: 'setOpen' },
    loading: { control: 'boolean' },
    name: { control: 'text' },
    dependencies: { control: 'object' },
    openSelectUnitypackageDialog: { action: 'openSelectUnitypackageDialog' },
  },
  args: {
    isOpen: true,
    setOpen: fn(),
    loading: false,
    name: 'Example Asset Name',
    dependencies: [EXAMPLE_DEPENDENCIES],
    openSelectUnitypackageDialog: fn(),
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
        <InternalDependencyDialog
          {...args}
          isOpen={isOpen}
          setOpen={handleSetOpen}
        />
      </>
    )
  },
} satisfies Meta<typeof InternalDependencyDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const Multiple: Story = {
  args: {
    dependencies: [
      EXAMPLE_DEPENDENCIES,
      {
        ...EXAMPLE_DEPENDENCIES,
        id: '2',
        assetType: 'AvatarWearable',
        name: 'Example Asset 2',
      },
    ],
  },
}
