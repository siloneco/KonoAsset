import type { Meta, StoryObj } from '@storybook/react-vite'
import { InternalResetDialog } from '.'
import { ComponentProps, FC, useCallback, useState } from 'react'
import { fn } from 'storybook/test'

const meta = {
  title: 'reset-dialog/ResetDialog',
  component: InternalResetDialog,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    deleteInProgress: { control: 'boolean' },
    deleteAppData: { control: 'boolean' },
    deleteMetadata: { control: 'boolean' },
    deleteAssetData: { control: 'boolean' },
    setDeleteAppData: { action: 'setDeleteAppData' },
    setDeleteMetadata: { action: 'setDeleteMetadata' },
    setDeleteAssetData: { action: 'setDeleteAssetData' },
    confirm: { control: 'boolean' },
    setConfirm: { action: 'setConfirm' },
    executeReset: { action: 'executeReset' },
  },
  args: {
    deleteInProgress: false,
    deleteAppData: false,
    deleteMetadata: false,
    deleteAssetData: false,
    setDeleteAppData: fn(),
    setDeleteMetadata: fn(),
    setDeleteAssetData: fn(),
    confirm: false,
    setConfirm: fn(),
    executeReset: fn(),
  },
  render: (args) => <ComponentRendererWithHooks {...args} />,
} satisfies Meta<typeof InternalResetDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultOpened: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
}

export const Checked: Story = {
  args: {
    deleteAppData: true,
    deleteMetadata: true,
    deleteAssetData: true,
    confirm: true,
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
}

export const DeleteInProgress: Story = {
  args: {
    deleteAppData: true,
    deleteMetadata: true,
    deleteAssetData: true,
    confirm: true,
    deleteInProgress: true,
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
}

const ComponentRendererWithHooks: FC<
  ComponentProps<typeof InternalResetDialog>
> = (args) => {
  const [deleteAppData, setDeleteAppData] = useState(args.deleteAppData)
  const [deleteMetadata, setDeleteMetadata] = useState(args.deleteMetadata)
  const [deleteAssetData, setDeleteAssetData] = useState(args.deleteAssetData)
  const [confirm, setConfirm] = useState(args.confirm)
  const [deleteInProgress, setDeleteInProgress] = useState(
    args.deleteInProgress,
  )

  const wrappedSetDeleteAppData = useCallback(
    (deleteAppData: boolean) => {
      args.setDeleteAppData(deleteAppData)
      setDeleteAppData(deleteAppData)

      args.setConfirm(false)
      setConfirm(false)
    },
    [args],
  )

  const wrappedSetDeleteMetadata = useCallback(
    (deleteMetadata: boolean) => {
      args.setDeleteMetadata(deleteMetadata)
      setDeleteMetadata(deleteMetadata)

      args.setConfirm(false)
      setConfirm(false)
    },
    [args],
  )

  const wrappedSetDeleteAssetData = useCallback(
    (deleteAssetData: boolean) => {
      args.setDeleteAssetData(deleteAssetData)
      setDeleteAssetData(deleteAssetData)

      args.setConfirm(false)
      setConfirm(false)
    },
    [args],
  )

  const wrappedSetConfirm = useCallback(
    (confirm: boolean) => {
      args.setConfirm(confirm)
      setConfirm(confirm)
    },
    [args],
  )

  const wrappedExecuteReset = useCallback(async () => {
    setDeleteInProgress(true)

    await args.executeReset()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setDeleteAppData(false)
    setDeleteMetadata(false)
    setDeleteAssetData(false)
    setConfirm(false)
    setDeleteInProgress(false)
  }, [args])

  return (
    <InternalResetDialog
      {...args}
      deleteAppData={deleteAppData}
      deleteMetadata={deleteMetadata}
      deleteAssetData={deleteAssetData}
      setDeleteAppData={wrappedSetDeleteAppData}
      setDeleteMetadata={wrappedSetDeleteMetadata}
      setDeleteAssetData={wrappedSetDeleteAssetData}
      confirm={confirm}
      setConfirm={wrappedSetConfirm}
      deleteInProgress={deleteInProgress}
      executeReset={wrappedExecuteReset}
    />
  )
}
