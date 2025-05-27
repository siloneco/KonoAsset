import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetFormItemSelectTab } from '.'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ReactNode } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const MockTanstackRouterLinkComponent = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => <span className={cn('cursor-pointer', className)}>{children}</span>

const meta = {
  title: 'asset-form/Components/AssetFormItemSelectTab',
  component: AssetFormItemSelectTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    tabIndex: { control: 'object' },
    zipExtraction: { control: 'boolean' },
    openFileOrDirSelector: { action: 'openFileOrDirSelector' },
    setItems: { action: 'setItems' },
    nextTab: { action: 'nextTab' },
  },
  args: {
    tabIndex: { current: 1, total: 5 },
    zipExtraction: false,
    openFileOrDirSelector: fn(),
    setItems: fn(),
    nextTab: fn(),
    TanstackRouterLinkComponent: MockTanstackRouterLinkComponent,
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
} satisfies Meta<typeof AssetFormItemSelectTab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
