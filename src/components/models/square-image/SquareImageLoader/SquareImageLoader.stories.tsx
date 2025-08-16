import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SquareImageLoader } from '.'

const meta = {
  title: 'square-image/Components/SquareImageLoader',
  component: SquareImageLoader,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    src: { control: 'text' },
    loading: { control: 'boolean' },
    assetType: {
      control: 'select',
      options: ['Avatar', 'AvatarWearable', 'WorldObject'],
    },
    onError: { action: 'onError' },
  },
  args: {
    src: undefined,
    loading: false,
    assetType: 'Avatar',
    onError: fn(),
  },
  decorators: [
    (Story) => (
      <div className="size-52">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SquareImageLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const Loaded: Story = {
  args: {
    src: '/logo.png',
  },
}

export const NoImageAvatar: Story = {
  name: 'No Image (Avatar)',
  args: {},
}

export const NoImageAvatarWearable: Story = {
  name: 'No Image (AvatarWearable)',
  args: {
    assetType: 'AvatarWearable',
  },
}

export const NoImageWorldObject: Story = {
  name: 'No Image (WorldObject)',
  args: {
    assetType: 'WorldObject',
  },
}

export const NoImageOtherAsset: Story = {
  name: 'No Image (OtherAsset)',
  args: {
    assetType: 'OtherAsset',
  },
}
