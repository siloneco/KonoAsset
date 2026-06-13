import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { InternalSquareImage } from '.'
import { ComponentProps, FC, useCallback, useState } from 'react'

const SquareImageWithHooks: FC<ComponentProps<typeof InternalSquareImage>> = (
  args,
) => {
  const [index, setIndex] = useState<number>(args.indexSelector?.index ?? 0)

  const handleSetIndex = useCallback(
    (index: number) => {
      args.indexSelector?.setIndex(index)
      setIndex(index)
    },
    [args.indexSelector],
  )

  if (args.indexSelector === undefined) {
    return <InternalSquareImage {...args} />
  }

  return (
    <InternalSquareImage
      {...args}
      indexSelector={{
        index,
        setIndex: handleSetIndex,
        maxIndex: args.indexSelector?.maxIndex ?? 0,
      }}
    />
  )
}

const meta = {
  title: 'square-image/SquareImage',
  component: InternalSquareImage,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    src: { control: 'text' },
    indexSelector: { control: 'object' },
    selectUserImage: { action: 'selectUserImage' },
    onError: { action: 'onError' },
    loading: { control: 'boolean' },
    assetType: {
      control: 'select',
      options: ['Avatar', 'AvatarWearable', 'WorldObject', 'OtherAsset'],
    },
    className: { control: 'text' },
  },
  args: {
    src: '/logo.png',
    indexSelector: {
      index: 0,
      maxIndex: 4,
      setIndex: fn(),
    },
    selectUserImage: fn(),
    loading: false,
    assetType: 'Avatar',
    className: 'w-52',
  },
  render: (args) => <SquareImageWithHooks {...args} />,
} satisfies Meta<typeof InternalSquareImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const WideHorizontal: Story = {
  args: {
    src: 'https://placehold.co/600x400',
  },
}

export const WideVertical: Story = {
  args: {
    src: 'https://placehold.co/400x600',
  },
}

export const NoImageAvatar: Story = {
  name: 'No Image (Avatar)',
  args: {
    src: undefined,
    assetType: 'Avatar',
  },
}

export const NoImageAvatarWearable: Story = {
  name: 'No Image (AvatarWearable)',
  args: {
    src: undefined,
    assetType: 'AvatarWearable',
  },
}

export const NoImageWorldObject: Story = {
  name: 'No Image (WorldObject)',
  args: {
    src: undefined,
    assetType: 'WorldObject',
  },
}

export const NoImageOtherAsset: Story = {
  name: 'No Image (OtherAsset)',
  args: {
    src: undefined,
    assetType: 'OtherAsset',
  },
}

export const NoIndexSelector: Story = {
  args: {
    indexSelector: undefined,
  },
}

export const DisabledIndexSelector: Story = {
  args: {
    indexSelector: {
      index: 0,
      maxIndex: -1,
      setIndex: fn(),
    },
  },
}

export const NoPathSelector: Story = {
  args: {
    selectUserImage: undefined,
  },
}

export const NoIndexAndPathSelector: Story = {
  name: 'No Index and Path Selector',
  args: {
    indexSelector: undefined,
    selectUserImage: undefined,
  },
}
