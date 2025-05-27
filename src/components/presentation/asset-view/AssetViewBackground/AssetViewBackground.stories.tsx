import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetViewBackground } from '.'

const meta = {
  title: 'asset-view/Components/AssetViewBackground',
  component: AssetViewBackground,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    type: { control: 'select', options: ['NoAssets', 'NoResults'] },
    openAddAssetDialog: { action: 'openAddAssetDialog' },
    clearAssetFilters: { action: 'clearAssetFilters' },
  },
  args: {
    openAddAssetDialog: fn(),
    clearAssetFilters: fn(),
  },
} satisfies Meta<typeof AssetViewBackground>

export default meta
type Story = StoryObj<typeof meta>

export const NoAssets: Story = {
  args: {
    type: 'NoAssets',
  },
}

export const NoResults: Story = {
  args: {
    type: 'NoResults',
  },
}
