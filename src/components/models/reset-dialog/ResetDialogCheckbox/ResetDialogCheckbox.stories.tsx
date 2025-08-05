import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetDialogCheckbox } from '.'
import { useCallback, useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  title: 'reset-dialog/components/ResetDialogCheckbox',
  component: ResetDialogCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    children: { control: 'object' },
    checked: { control: 'boolean' },
    setChecked: { action: 'setChecked' },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
  },
  args: {
    children: 'Example checkbox',
    checked: false,
    setChecked: fn(),
    disabled: false,
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked)

    const wrappedSetChecked = useCallback(
      (checked: boolean) => {
        setChecked(checked)
        args.setChecked(checked)
      },
      [args],
    )

    return (
      <ResetDialogCheckbox
        {...args}
        checked={checked}
        setChecked={wrappedSetChecked}
      />
    )
  },
} satisfies Meta<typeof ResetDialogCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const WithSubText: Story = {
  args: {
    children: (
      <>
        Example checkbox
        <span className="ml-2 text-muted-foreground">(sub text)</span>
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
