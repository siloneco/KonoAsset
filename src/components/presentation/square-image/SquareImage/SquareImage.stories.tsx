import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { SquareImage } from '.'
import { ComponentProps, FC, useCallback, useState } from 'react'

const SquareImageWithHooks: FC<ComponentProps<typeof SquareImage>> = (args) => {
  const [index, setIndex] = useState<number>(args.indexSelector?.index ?? 0)

  const handleSetIndex = useCallback(
    (index: number) => {
      args.indexSelector?.setIndex(index)
      setIndex(index)
    },
    [args.indexSelector],
  )

  if (args.indexSelector === undefined) {
    return <SquareImage {...args} />
  }

  return (
    <SquareImage
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
  component: SquareImage,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    src: { control: 'text' },
    indexSelector: { control: 'object' },
    userImageProvider: { control: 'object' },
    onError: { action: 'onError' },
    loading: { control: 'boolean' },
    assetType: {
      control: 'select',
      options: ['Avatar', 'AvatarWearable', 'WorldObject'],
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
    userImageProvider: {
      openImagePathSelector: fn(),
      onImagePathProvided: fn(),
    },
    loading: false,
    assetType: 'Avatar',
    className: 'w-52',
  },
  render: (args) => <SquareImageWithHooks {...args} />,
} satisfies Meta<typeof SquareImage>

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

export const NoIndexSelector: Story = {
  args: {
    indexSelector: undefined,
  },
}

export const NoPathSelector: Story = {
  args: {
    userImageProvider: undefined,
  },
}

export const NoIndexAndPathSelector: Story = {
  name: 'No Index and Path Selector',
  args: {
    indexSelector: undefined,
    userImageProvider: undefined,
  },
}
