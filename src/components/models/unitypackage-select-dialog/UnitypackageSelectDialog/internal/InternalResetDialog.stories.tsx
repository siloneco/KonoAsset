import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalUnitypackageSelectDialog } from '.'
import { ComponentProps, FC, useCallback, useState } from 'react'
import { fn } from 'storybook/test'
import { Button } from '@/components/ui/button'

const exampleUnitypackageFiles = (index: number) => {
  return {
    fileName: `example-file-${index}.unitypackage`,
    absolutePath: `./example-path/example-file-${index}.unitypackage`,
  }
}

const meta = {
  title: 'unitypackage-select-dialog/UnitypackageSelectDialog',
  component: InternalUnitypackageSelectDialog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
  argTypes: {
    dialogOpen: { control: 'boolean' },
    setDialogOpen: { action: 'setDialogOpen' },
    unitypackageFiles: { control: 'object' },
    skipDialogPreferenceEnabled: { control: 'boolean' },
    setAndSaveSkipDialogPreference: {
      action: 'setAndSaveSkipDialogPreference',
    },
    openFileInFileManager: { action: 'openFileInFileManager' },
    openManagedDir: { action: 'openManagedDir' },
  },
  args: {
    dialogOpen: false,
    setDialogOpen: fn(),
    unitypackageFiles: {
      '': [exampleUnitypackageFiles(1), exampleUnitypackageFiles(2)],
      './example-path': [
        exampleUnitypackageFiles(3),
        exampleUnitypackageFiles(4),
      ],
    },
    skipDialogPreferenceEnabled: false,
    setAndSaveSkipDialogPreference: fn(),
    openFileInFileManager: fn(),
    openManagedDir: fn(),
  },
  render: (args) => <ComponentRendererWithHooksAndOpenButton {...args} />,
} satisfies Meta<typeof InternalUnitypackageSelectDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Scrollable: Story = {
  args: {
    unitypackageFiles: {
      '': [
        ...Array.from({ length: 10 }, (_, i) =>
          exampleUnitypackageFiles(i + 1),
        ),
      ],
    },
  },
}

export const Truncated: Story = {
  args: {
    unitypackageFiles: {
      'a-very-long-unitypackage-filename-for-testing-truncation-logic-a-very-long-unitypackage-filename-for-testing-truncation-logic':
        [
          {
            fileName: `a-very-long-unitypackage-filename-for-testing-truncation-logic.unitypackage`,
            absolutePath: `./example-path/a-very-long-unitypackage-filename-for-testing-truncation-logic.unitypackage`,
          },
        ],
    },
  },
}

const ComponentRendererWithHooksAndOpenButton: FC<
  ComponentProps<typeof InternalUnitypackageSelectDialog>
> = (args) => {
  const [dialogOpen, setDialogOpen] = useState(args.dialogOpen)
  const [skipDialogPreferenceEnabled, setSkipDialogPreferenceEnabled] =
    useState(args.skipDialogPreferenceEnabled)

  const wrappedDialogOpen = useCallback(
    (dialogOpen: boolean) => {
      args.setDialogOpen(dialogOpen)
      setDialogOpen(dialogOpen)
    },
    [args, setDialogOpen],
  )

  const wrappedSkipDialogPreferenceEnabled = useCallback(
    (skipDialogPreferenceEnabled: boolean) => {
      args.setAndSaveSkipDialogPreference(skipDialogPreferenceEnabled)
      setSkipDialogPreferenceEnabled(skipDialogPreferenceEnabled)
    },
    [args, setSkipDialogPreferenceEnabled],
  )

  return (
    <>
      <Button onClick={() => wrappedDialogOpen(true)}>Open</Button>
      <InternalUnitypackageSelectDialog
        {...args}
        dialogOpen={dialogOpen}
        setDialogOpen={wrappedDialogOpen}
        skipDialogPreferenceEnabled={skipDialogPreferenceEnabled}
        setAndSaveSkipDialogPreference={wrappedSkipDialogPreferenceEnabled}
      />
    </>
  )
}
