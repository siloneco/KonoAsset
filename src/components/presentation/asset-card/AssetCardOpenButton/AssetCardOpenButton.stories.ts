import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetCardOpenButton } from '.'

const meta = {
  title: 'asset-card/Components/AssetCardOpenButton',
  component: AssetCardOpenButton,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    className: { control: 'text' },
    mainButtonClassName: { control: 'text' },
    sideButtonClassName: { control: 'text' },
    hideOpenButtonText: { control: 'boolean' },
    onDependencyDialogButtonClick: {
      action: 'onDependencyDialogButtonClick',
    },
  },
  args: {
    onCopyPathButtonClick: fn(),
    onOpenManagedDirButtonClick: fn(),
    onOpenButtonClick: () => {
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(true), 1000),
      )
    },
  },
} satisfies Meta<typeof AssetCardOpenButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'w-32',
    onDependencyDialogButtonClick: fn(),
  },
}

export const Wide: Story = {
  args: {
    className: 'w-52',
    onDependencyDialogButtonClick: fn(),
  },
}

export const NoDependency: Story = {
  args: {
    className: 'w-32',
    onDependencyDialogButtonClick: null,
  },
}
