import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalAssetCardMeatballMenu } from './'
import { fn } from 'storybook/test'

const meta = {
  title: 'asset-card/Components/AssetCardMeatballMenu',
  component: InternalAssetCardMeatballMenu,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    className: { control: 'text' },
    boothUrl: { control: 'text' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    openDataManagementDialog: { action: 'openDataManagementDialog' },
    executeAssetDeletion: { action: 'executeAssetDeletion' },
  },
  args: {
    className: '',
    boothUrl: 'https://booth.pm/ja/items/6641548',
    openEditAssetDialog: fn(),
    openDataManagementDialog: fn(),
    executeAssetDeletion: fn(),
  },
  render: (args) => {
    const executeAssetDeletion = async () => {
      args.executeAssetDeletion()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return (
      <InternalAssetCardMeatballMenu
        {...args}
        executeAssetDeletion={executeAssetDeletion}
      />
    )
  },
} satisfies Meta<typeof InternalAssetCardMeatballMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutBoothUrl: Story = {
  name: 'Without BOOTH URL',
  args: {
    boothUrl: undefined,
  },
}
