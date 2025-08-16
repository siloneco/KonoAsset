import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SquareImageSelectFooter } from '.'
import { ComponentProps, FC, useState } from 'react'

const SquareImageSelectFooterWithHooks: FC<
  ComponentProps<typeof SquareImageSelectFooter>
> = (args) => {
  const [index, setIndex] = useState(args.index)

  const handleSetIndex = (index: number) => {
    args.setIndex(index)
    setIndex(index)
  }

  return (
    <SquareImageSelectFooter
      {...args}
      index={index}
      setIndex={handleSetIndex}
    />
  )
}

const meta = {
  title: 'square-image/components/SquareImageSelectFooter',
  component: SquareImageSelectFooter,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    index: { control: 'number' },
    setIndex: { action: 'setIndex' },
    maxIndex: { control: 'number' },
  },
  args: {
    index: 0,
    setIndex: fn(),
    maxIndex: 4,
  },
  render: (args) => <SquareImageSelectFooterWithHooks {...args} />,
} satisfies Meta<typeof SquareImageSelectFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    maxIndex: -1,
  },
}
