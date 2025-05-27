import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetFormPathConfirmationTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const meta = {
  title: 'asset-form/Components/AssetFormPathConfirmationTab',
  component: AssetFormPathConfirmationTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    existingPaths: { control: 'object' },
    nonExistingPaths: { control: 'object' },
    submit: { action: 'submit' },
    previousTab: { action: 'previousTab' },
  },
  args: {
    existingPaths: ['example/path/1', 'example/path/2'],
    nonExistingPaths: ['example/path/3', 'example/path/4'],
    submit: fn(),
    previousTab: fn(),
  },
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<typeof AssetFormPathConfirmationTab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SubmitButtonDisabled: Story = {
  args: {
    existingPaths: [],
  },
}
