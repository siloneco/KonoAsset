import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetViewListLayout } from '.'
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
  title: 'asset-view/Components/AssetViewListLayout',
  component: AssetViewListLayout,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    sortedAssetSummaries: { control: 'object' },
    openMemoDialog: { action: 'openMemoDialog' },
    onMainOpenButtonClick: { action: 'onMainOpenButtonClick' },
    onOpenManagedDirButtonClick: { action: 'onOpenManagedDirButtonClick' },
    getAssetDirectoryPath: { action: 'getAssetDirectoryPath' },
    openDependencyDialog: { action: 'openDependencyDialog' },
    language: {
      control: 'select',
      options: ['en-US', 'en-GB', 'ja-JP', 'zh-CN'],
    },
    openDirEditDialog: { action: 'openDirEditDialog' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    deleteAsset: { action: 'deleteAsset' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
  },
  args: {
    sortedAssetSummaries: Array.from({ length: 10 }, () => ({
      ...ASSET_TEMPLATE,
    })),
    openMemoDialog: fn(),
    onMainOpenButtonClick: () => {
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(true), 1000),
      )
    },
    onOpenManagedDirButtonClick: fn(),
    getAssetDirectoryPath: fn(),
    openDependencyDialog: fn(),
    language: 'en-US',
    openDirEditDialog: fn(),
    openEditAssetDialog: fn(),
    deleteAsset: () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1000))
    },
    resolveImageAbsolutePath: fn(),
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
} satisfies Meta<typeof AssetViewListLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
