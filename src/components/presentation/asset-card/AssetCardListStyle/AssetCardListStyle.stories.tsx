import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetCardListStyle } from '.'
import { AssetSummary } from '@/lib/bindings'
import { Button } from '@/components/ui/button'

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
  title: 'asset-card/Components/AssetCardListStyle',
  component: AssetCardListStyle,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    asset: { control: 'object' },
    className: { control: 'text' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
  },
  args: {
    asset: ASSET_TEMPLATE,
    className: '',
    resolveImageAbsolutePath: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-128">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AssetCardListStyle>

export default meta
type Story = StoryObj<typeof meta>

export const Avatar: Story = {
  args: {},
}

export const AvatarWearable: Story = {
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'AvatarWearable',
    },
  },
}

export const WorldObject: Story = {
  args: {
    asset: {
      ...ASSET_TEMPLATE,
      assetType: 'WorldObject',
    },
  },
}

export const WithButton: Story = {
  args: {
    children: <Button>Action</Button>,
  },
}

export const WithButtonTiny: Story = {
  args: {
    children: <Button>Action</Button>,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}
