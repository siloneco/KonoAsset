import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetCard } from '.'
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
  title: 'asset-card/AssetCard',
  component: AssetCard,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    asset: { control: 'object' },
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
    asset: ASSET_TEMPLATE,
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
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AssetCard>

export default meta
type Story = StoryObj<typeof meta>

export const SmallAvatar: Story = {
  name: 'Avatar (Small)',
  args: {
    displaySize: 'Small',
  },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
}

export const MediumAvatar: Story = {
  name: 'Avatar (Medium)',
}

export const LargeAvatar: Story = {
  name: 'Avatar (Large)',
  args: {
    displaySize: 'Large',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const SmallAvatarWearable: Story = {
  name: 'Avatar Wearable (Small)',
  args: {
    displaySize: 'Small',
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'AvatarWearable',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
}

export const MediumAvatarWearable: Story = {
  name: 'Avatar Wearable (Medium)',
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'AvatarWearable',
    },
  },
}

export const LargeAvatarWearable: Story = {
  name: 'Avatar Wearable (Large)',
  args: {
    displaySize: 'Large',
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'AvatarWearable',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const SmallWorldObject: Story = {
  name: 'World Object (Small)',
  args: {
    displaySize: 'Small',
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'WorldObject',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
}

export const MediumWorldObject: Story = {
  name: 'World Object (Medium)',
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'WorldObject',
    },
  },
}

export const LargeWorldObject: Story = {
  name: 'World Object (Large)',
  args: {
    displaySize: 'Large',
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'WorldObject',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const NoMemo: Story = {
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      hasMemo: false,
    },
  },
}

export const NoDependency: Story = {
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      dependencies: [],
    },
  },
}

export const NoBooth: Story = {
  name: 'No BOOTH',
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      boothItemId: null,
    },
  },
}
