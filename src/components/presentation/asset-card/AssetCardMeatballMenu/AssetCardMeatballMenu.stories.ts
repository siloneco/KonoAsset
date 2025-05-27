import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetCardMeatballMenu } from '.'

const meta = {
  title: 'asset-card/Components/AssetCardMeatballMenu',
  component: AssetCardMeatballMenu,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    language: { control: 'text' },
    boothItemId: { control: 'number' },
    openDirEditDialog: { action: 'openDirEditDialog' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    deleteAsset: { action: 'deleteAsset' },
  },
  args: {
    language: 'en-US',
    boothItemId: 6641548,
    openDirEditDialog: fn(),
    openEditAssetDialog: fn(),
    deleteAsset: () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1500))
    },
  },
} satisfies Meta<typeof AssetCardMeatballMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
