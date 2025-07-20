import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChangelogVersionSection } from '.'
import { LocalizedChanges } from '@/lib/bindings'

const exampleChange: LocalizedChanges = {
  version: '1.0.0',
  pre_release: false,
  features: ['Feature 1', 'Feature 2'],
  fixes: ['Fix 1', 'Fix 2'],
  others: ['Other 1', 'Other 2'],
}

const meta = {
  title: 'changelog/Components/ChangelogVersionSection',
  component: ChangelogVersionSection,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    change: { control: 'object' },
  },
  args: {
    change: exampleChange,
  },
} satisfies Meta<typeof ChangelogVersionSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PreRelease: Story = {
  args: {
    change: {
      ...exampleChange,
      version: '1.0.1-rc.0',
      pre_release: true,
    },
  },
}

export const Truncated: Story = {
  args: {
    className: 'w-64',
    change: {
      ...exampleChange,
      others: [
        'Other 1: Other 1: This is a longer description to test how the changelog handles longer text entries',
        'Other 2',
      ],
    },
  },
}
