import type { Meta, StoryObj } from '@storybook/react-vite'
import { Changelog } from '.'
import { LocalizedChanges } from '@/lib/bindings'

const exampleChanges: LocalizedChanges[] = [
  {
    version: '1.0.0',
    pre_release: false,
    features: ['Feature 1', 'Feature 2'],
    fixes: ['Fix 1', 'Fix 2'],
    others: [
      'Other 1: This is a longer description to test how the changelog handles longer text entries',
      'Other 2',
    ],
  },
  {
    version: '1.0.1-rc.0',
    pre_release: true,
    features: ['Feature 3', 'Feature 4'],
    fixes: ['Fix 3', 'Fix 4'],
    others: ['Other 3', 'Other 4'],
  },
]

const meta = {
  title: 'changelog/Changelog',
  component: Changelog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    changes: { control: 'object' },
  },
  args: {
    changes: exampleChanges,
  },
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-2rem)] max-w-128">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Changelog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    changes: null,
  },
}
