import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetCardDeleteDialog } from '.'

const meta = {
  title: 'asset-card/Components/AssetCardDeleteDialog',
  component: AssetCardDeleteDialog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    children: { control: 'text' },
    deleteAsset: { action: 'deleteAsset' },
    dialogOpen: { control: 'boolean' },
    setDialogOpen: { action: 'setDialogOpen' },
  },
  args: {
    children: '',
    dialogOpen: true,
    setDialogOpen: fn(),
    deleteAsset: () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1500))
    },
  },
} satisfies Meta<typeof AssetCardDeleteDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    dialogOpen: true,
  },
}
