import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetViewGridLayout } from '.'
import { AssetSummary } from '@/lib/bindings'

const ASSET_TEMPLATE: AssetSummary = {
  id: '123456',
  name: 'Sample Asset',
  creator: 'Sample Asset Creator',
  assetType: 'Avatar',
  imageFilename: null,
  hasMemo: true,
  boothItemId: 6641548,
  dependencies: ['dummy'],
  publishedAt: 1716460800,
}

const meta = {
  title: 'asset-view/Components/AssetViewGridLayout',
  component: AssetViewGridLayout,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    sortedAssetSummaries: { control: 'object' },
    columnCount: { control: 'number' },
    language: {
      control: 'select',
      options: ['en-US', 'en-GB', 'ja-JP', 'zh-CN'],
    },
    displaySize: { control: 'select', options: ['Small', 'Medium', 'Large'] },
    onMainOpenButtonClick: { action: 'onMainOpenButtonClick' },
    onOpenManagedDirButtonClick: { action: 'onOpenManagedDirButtonClick' },
    getAssetDirectoryPath: { action: 'getAssetDirectoryPath' },
    openDirEditDialog: { action: 'openDirEditDialog' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    openMemoDialog: { action: 'openMemoDialog' },
    openDependencyDialog: { action: 'openDependencyDialog' },
    deleteAsset: { action: 'deleteAsset' },
    setFilterAssetType: { action: 'setFilterAssetType' },
    setCreatorNameFilter: { action: 'setCreatorNameFilter' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
  },
  args: {
    sortedAssetSummaries: Array.from({ length: 20 }, () => ({
      ...ASSET_TEMPLATE,
    })),
    columnCount: 5,
    language: 'en-US',
    displaySize: 'Medium',
    onMainOpenButtonClick: () => {
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(true), 1000),
      )
    },
    onOpenManagedDirButtonClick: fn(),
    getAssetDirectoryPath: fn(),
    openDirEditDialog: fn(),
    openEditAssetDialog: fn(),
    openMemoDialog: fn(),
    openDependencyDialog: fn(),
    deleteAsset: () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1000))
    },
    setFilterAssetType: fn(),
    setCreatorNameFilter: fn(),
    resolveImageAbsolutePath: fn(),
  },
} satisfies Meta<typeof AssetViewGridLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
