import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoDialogContentsConstructor } from '.'

const meta = {
  title: 'memo-dialog/components/MemoDialogContentsConstructor',
  component: MemoDialogContentsConstructor,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'This is an example memo',
  },
} satisfies Meta<typeof MemoDialogContentsConstructor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithURL: Story = {
  args: {
    children: 'This text, https://www.google.com , is a URL',
  },
}

export const HorizontallyLongText: Story = {
  args: {
    children: 'This is an example memo text. '.repeat(20),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl p-2 border-2 border-border">
        <Story />
      </div>
    ),
  ],
}
