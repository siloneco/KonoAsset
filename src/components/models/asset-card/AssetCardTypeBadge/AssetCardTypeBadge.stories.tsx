import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AssetCardTypeBadge } from '.'

const meta = {
  title: 'asset-card/Components/AssetCardTypeBadge',
  component: AssetCardTypeBadge,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    className: { control: 'text' },
    type: {
      control: 'select',
      options: ['Avatar', 'AvatarWearable', 'WorldObject', 'OtherAsset'],
    },
    onClick: { action: 'onClick' },
  },
  args: {
    className: '',
    onClick: fn(),
  },
} satisfies Meta<typeof AssetCardTypeBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Avatar: Story = {
  args: {
    type: 'Avatar',
  },
}

export const AvatarWearable: Story = {
  args: {
    type: 'AvatarWearable',
  },
}

export const WorldObject: Story = {
  args: {
    type: 'WorldObject',
  },
}

export const OtherAsset: Story = {
  args: {
    type: 'OtherAsset',
  },
}

export const WithoutOnClick: Story = {
  name: 'Without onClick',
  args: {
    type: 'Avatar',
    onClick: undefined,
  },
}

export const Truncated: Story = {
  args: {
    type: 'AvatarWearable',
    className: 'w-10/11',
  },
}
