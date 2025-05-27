import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetCardOpenMemoDialogButton } from '.'

const meta = {
  title: 'asset-card/Components/AssetCardOpenMemoDialogButton',
  component: AssetCardOpenMemoDialogButton,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    openMemoDialog: { action: 'openMemoDialog' },
  },
  args: {
    openMemoDialog: fn(),
  },
} satisfies Meta<typeof AssetCardOpenMemoDialogButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
