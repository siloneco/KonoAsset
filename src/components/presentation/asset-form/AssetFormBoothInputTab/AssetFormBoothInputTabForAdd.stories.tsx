import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetFormBoothInputTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AddProps, CommonProps } from './AssetFormBoothInputTab'
import { BoothAssetInfo, Result } from '@/lib/bindings'
import { FC, useCallback } from 'react'

const MockComponent: FC<CommonProps & AddProps> = (props) => {
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
  title: 'asset-form/Components/AssetFormBoothInputTab (Add)',
  component: AssetFormBoothInputTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    type: { control: 'select', options: ['add', 'edit'] },
    tabIndex: { control: 'object' },
    fetchBoothInformation: { action: 'fetchBoothInformation' },
    checkDuplicateAsset: { action: 'checkDuplicateAsset' },
    setBoothInformation: { action: 'setBoothInformation' },
    nextTab: { action: 'nextTab' },
    filenames: { control: 'object' },
    previousTab: { action: 'previousTab' },
  },
  args: {
    type: 'add',
    tabIndex: { current: 1, total: 5 },
    fetchBoothInformation: fn(),
    checkDuplicateAsset: fn(),
    setBoothInformation: fn(),
    nextTab: fn(),
    filenames: ['sample.txt'],
    previousTab: fn(),
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
} satisfies Meta<CommonProps & AddProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const MultipleFiles: Story = {
  args: {
    filenames: ['sample.txt', 'sample2.txt', 'sample3.txt'],
  },
}
