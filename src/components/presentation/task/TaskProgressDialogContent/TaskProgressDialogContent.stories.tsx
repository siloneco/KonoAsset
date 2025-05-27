import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { TaskProgressDialogContent } from './TaskProgressDialogContent'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ComponentProps, FC, useCallback } from 'react'

const TaskProgressDialogContentWrapper: FC<
  ComponentProps<typeof TaskProgressDialogContent>
> = (props) => {
  const cancel = useCallback(async () => {
    props.cancel()
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }, [props])

  return <TaskProgressDialogContent {...props} cancel={cancel} />
}

const meta = {
  title: 'task/TaskProgressDialogContent',
  component: TaskProgressDialogContent,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    message: { control: 'text' },
    progress: { control: 'number' },
    cancel: { action: 'cancel' },
  },
  args: {
    title: 'Executing...',
    description: 'Please wait while the task is being processed',
    message: 'Task Progress Message',
    progress: 70,
    cancel: fn(),
  },
  render: (args) => <TaskProgressDialogContentWrapper {...args} />,
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<typeof TaskProgressDialogContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MessageOverflow: Story = {
  args: {
    message:
      'This is a very long message that will definitely overflow the dialog content and demonstrate how the component handles text truncation',
  },
}
