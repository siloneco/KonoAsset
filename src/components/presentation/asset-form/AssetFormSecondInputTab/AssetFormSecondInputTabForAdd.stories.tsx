import type { Meta, StoryObj } from '@storybook/react'
import { AssetFormSecondInputTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { FC, useState } from 'react'
import { fn } from '@storybook/test'
import { AssetSummary } from '@/lib/bindings'
import { AddProps, CommonProps } from './AssetFormSecondInputTab'

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

const AssetFormSecondInputTabWrapper: FC<CommonProps & AddProps> = (props) => {
  const [memo, setMemo] = useState<string>(props.assetMemo.value)
  const [dependencies, setDependencies] = useState<string[]>(
    props.assetDependencies.value,
  )
  const [deleteSourceChecked, setDeleteSourceChecked] = useState<boolean>(
    props.preference?.deleteSource ?? false,
  )

  return (
    <AssetFormSecondInputTab
      {...props}
      assetMemo={{ value: memo, setValue: setMemo }}
      assetDependencies={{ value: dependencies, setValue: setDependencies }}
      preference={{
        deleteSource: deleteSourceChecked,
        setDeleteSource: async (v) => setDeleteSourceChecked(v),
      }}
    />
  )
}

const meta = {
  title: 'asset-form/Components/AssetFormSecondInputTab (Add)',
  component: AssetFormSecondInputTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    type: { control: 'select', options: ['add'] },
    tabIndex: { control: 'object' },
    assetSummaries: { control: 'object' },
    assetMemo: { control: 'object' },
    assetDependencies: { control: 'object' },
    preference: { control: 'object' },
    searchAssetsByText: { action: 'searchAssetsByText' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
    submit: { action: 'submit' },
    submitInProgress: { control: 'boolean' },
    previousTab: { action: 'previousTab' },
  },
  args: {
    type: 'add',
    tabIndex: { current: 1, total: 5 },
    assetSummaries: [
      SAMPLE_ASSET_SUMMARY,
      {
        ...SAMPLE_ASSET_SUMMARY,
        id: '2',
        name: 'This is very long name that will test the overflow behavior of the asset selector input',
      },
    ],
    assetMemo: { value: '', setValue: fn() },
    assetDependencies: { value: [], setValue: fn() },
    preference: { deleteSource: false, setDeleteSource: fn() },
    searchAssetsByText: fn(),
    resolveImageAbsolutePath: fn(),
    submit: fn(),
    submitInProgress: false,
    previousTab: fn(),
  },
  render: (args) => <AssetFormSecondInputTabWrapper {...args} />,
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<CommonProps & AddProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
