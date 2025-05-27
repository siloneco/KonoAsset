import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetFormBoothInputTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { CommonProps, EditProps } from './AssetFormBoothInputTab'
import { FC, useCallback } from 'react'
import { BoothAssetInfo, Result } from '@/lib/bindings'

const MockComponent: FC<CommonProps & EditProps> = (props) => {
  const mockFetchBoothInformation = useCallback(
    async (boothItemId: number) => {
      props.fetchBoothInformation(boothItemId)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result: Result<BoothAssetInfo, string> = {
        status: 'ok',
        data: {
          id: 1,
          name: 'Mock Title',
          creator: 'Mock Creator',
          imageUrls: [],
          publishedAt: 123,
          estimatedAssetType: 'Avatar',
        },
      }

      return result
    },
    [props],
  )

  return (
    <AssetFormBoothInputTab
      {...props}
      fetchBoothInformation={mockFetchBoothInformation}
    />
  )
}

const meta = {
  title: 'asset-form/Components/AssetFormBoothInputTab (Edit)',
  component: AssetFormBoothInputTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    type: { control: 'select', options: ['add', 'edit'] },
    tabIndex: { control: 'object' },
    fetchBoothInformation: { action: 'fetchBoothInformation' },
    setBoothInformation: { action: 'setBoothInformation' },
    nextTab: { action: 'nextTab' },
  },
  args: {
    type: 'edit',
    tabIndex: { current: 1, total: 5 },
    fetchBoothInformation: fn(),
    setBoothInformation: fn(),
    nextTab: fn(),
  },
  render: (args) => <MockComponent {...args} />,
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<CommonProps & EditProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
