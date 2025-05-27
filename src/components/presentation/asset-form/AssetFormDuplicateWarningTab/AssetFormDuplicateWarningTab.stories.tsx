import type { Meta, StoryObj } from '@storybook/react'
import { AssetFormDuplicateWarningTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { fn } from '@storybook/test'
import { AssetSummary } from '@/lib/bindings'

const SAMPLE_ASSET_SUMMARY: AssetSummary = {
  id: '1',
  assetType: 'Avatar',
  name: 'Sample Avatar',
  creator: 'Sample Creator',
  imageFilename: null,
  hasMemo: false,
  dependencies: [],
  boothItemId: null,
  publishedAt: null,
}

const meta = {
  title: 'asset-form/Components/AssetFormDuplicateWarningTab',
  component: AssetFormDuplicateWarningTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    tabIndex: { control: 'object' },
    duplicateAssets: { control: 'object' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
    openAssetManagedDir: { action: 'openAssetManagedDir' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    openDirEditDialog: { action: 'openDirEditDialog' },
    nextTab: { action: 'nextTab' },
    previousTab: { action: 'previousTab' },
  },
  args: {
    tabIndex: { current: 1, total: 5 },
    duplicateAssets: [SAMPLE_ASSET_SUMMARY],
    resolveImageAbsolutePath: fn(),
    openAssetManagedDir: fn(),
    openEditAssetDialog: fn(),
    openDirEditDialog: fn(),
    nextTab: fn(),
    previousTab: fn(),
  },
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<typeof AssetFormDuplicateWarningTab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const MultipleAssets: Story = {
  args: {
    duplicateAssets: [
      SAMPLE_ASSET_SUMMARY,
      {
        ...SAMPLE_ASSET_SUMMARY,
        id: '2',
        assetType: 'AvatarWearable',
        name: 'Sample Avatar Wearable',
      },
    ],
  },
}

export const Overflow: Story = {
  args: {
    duplicateAssets: [
      SAMPLE_ASSET_SUMMARY,
      {
        ...SAMPLE_ASSET_SUMMARY,
        id: '2',
        assetType: 'AvatarWearable',
        name: 'This is a long asset name that overflows the width of the dialog and should be truncated',
      },
    ],
  },
}
