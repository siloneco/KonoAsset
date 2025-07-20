import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChangelogLineEntry } from '.'

const meta = {
  title: 'changelog/Components/ChangelogLineEntry',
  component: ChangelogLineEntry,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    className: { control: 'text' },
    variant: {
      control: 'select',
      options: ['features', 'fixes', 'others'],
    },
  },
  args: {
    children: 'This is a example changelog line entry',
    variant: 'features',
  },
} satisfies Meta<typeof ChangelogLineEntry>

export default meta
type Story = StoryObj<typeof meta>

export const Features: Story = {
  args: {
    variant: 'features',
  },
}

export const Fixes: Story = {
  args: {
    variant: 'fixes',
  },
}

export const Others: Story = {
  args: {
    variant: 'others',
  },
}

export const Truncated: Story = {
  args: {
    variant: 'features',
    className: 'w-48',
  },
}
