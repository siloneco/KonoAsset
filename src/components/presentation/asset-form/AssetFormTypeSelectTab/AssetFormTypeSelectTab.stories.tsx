import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetFormTypeSelectTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ComponentProps, FC, useState } from 'react'
import { AssetType } from '@/lib/bindings'

const AssetFormTypeSelectTabWrapper: FC<
  ComponentProps<typeof AssetFormTypeSelectTab>
> = (props) => {
  const [assetType, setAssetType] = useState<AssetType>(props.assetType)

  return (
    <AssetFormTypeSelectTab
      {...props}
      assetType={assetType}
      setAssetType={setAssetType}
    />
  )
}

const meta = {
  title: 'asset-form/Components/AssetFormTypeSelectTab',
  component: AssetFormTypeSelectTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    tabIndex: { control: 'object' },
    assetType: { control: 'select' },
    setAssetType: { action: 'setAssetType' },
    nextTab: { action: 'nextTab' },
    previousTab: { action: 'previousTab' },
  },
  args: {
    tabIndex: { current: 1, total: 5 },
    assetType: 'Avatar',
    setAssetType: fn(),
    nextTab: fn(),
    previousTab: fn(),
  },
  render: (args) => <AssetFormTypeSelectTabWrapper {...args} />,
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<typeof AssetFormTypeSelectTab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
