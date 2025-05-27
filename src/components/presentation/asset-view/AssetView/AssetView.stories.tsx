import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetView } from '.'
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
  title: 'asset-view/AssetView',
  component: AssetView,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    sortedAndFilteredAssetSummaries: { control: 'object' },
    assetCardSize: {
      control: 'select',
      options: ['Small', 'Medium', 'Large', 'List'],
    },
    noAssetRegistered: { control: 'boolean' },
    openAddAssetDialog: { action: 'openAddAssetDialog' },
    clearAssetFilters: { action: 'clearAssetFilters' },
    language: {
      control: 'select',
      options: ['en-US', 'en-GB', 'ja-JP', 'zh-CN'],
    },
    onMainOpenButtonClick: { action: 'onMainOpenButtonClick' },
    getAssetDirectoryPath: { action: 'getAssetDirectoryPath' },
    openDirEditDialog: { action: 'openDirEditDialog' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    openMemoDialog: { action: 'openMemoDialog' },
    openDependencyDialog: { action: 'openDependencyDialog' },
    deleteAsset: { action: 'deleteAsset' },
    setFilterAssetType: { action: 'setFilterAssetType' },
    setCreatorNameFilter: { action: 'setCreatorNameFilter' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
    onOpenManagedDirButtonClick: { action: 'onOpenManagedDirButtonClick' },
  },
  args: {
    sortedAndFilteredAssetSummaries: Array.from({ length: 20 }, () => ({
      ...ASSET_TEMPLATE,
    })),
    assetCardSize: 'Medium',
    noAssetRegistered: false,
    openAddAssetDialog: fn(),
    clearAssetFilters: fn(),
    language: 'en-US',
    onMainOpenButtonClick: () => {
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(true), 1000),
      )
    },
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
    onOpenManagedDirButtonClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-100px)] overflow-hidden">
        <div className="w-2/3 mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AssetView>

export default meta
type Story = StoryObj<typeof meta>

export const GridView: Story = {}

export const ListView: Story = {
  args: {
    assetCardSize: 'List',
  },
}

export const NoAssetsRegistered: Story = {
  args: {
    noAssetRegistered: true,
    sortedAndFilteredAssetSummaries: [],
  },
}

export const NoFilterResults: Story = {
  args: {
    noAssetRegistered: false,
    sortedAndFilteredAssetSummaries: [],
  },
}
