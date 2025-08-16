import type { Meta, StoryObj } from '@storybook/react-vite'
import { DirectoryBlock } from '.'
import { fn } from 'storybook/test'

const meta = {
  title: 'unitypackage-select-dialog/components/DirectoryBlock',
  component: DirectoryBlock,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    path: { control: 'text' },
    files: { control: 'object' },
    openFileInFileManager: { action: 'openFileInFileManager' },
  },
  args: {
    path: './example-path',
    files: [
      {
        fileName: 'example-file.unitypackage',
        absolutePath: './example-path/example-file.unitypackage',
      },
    ],
    openFileInFileManager: fn(),
  },
  decorators: [
    (Story) => {
      return (
        <div className="w-[90vw] max-w-128">
          <Story />
        </div>
      )
    },
  ],
} satisfies Meta<typeof DirectoryBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: {
    files: [
      {
        fileName: 'example-file-1.unitypackage',
        absolutePath: './example-path/example-file-1.unitypackage',
      },
      {
        fileName: 'example-file-2.unitypackage',
        absolutePath: './example-path/example-file-2.unitypackage',
      },
      {
        fileName: 'example-file-3.unitypackage',
        absolutePath: './example-path/example-file-3.unitypackage',
      },
    ],
  },
}

export const Truncated: Story = {
  args: {
    path: './this-is-a-very-long-path-to-a-file-that-is-too-long-to-be-displayed-in-the-ui',
    files: [
      {
        fileName:
          'this-is-a-very-long-file-name-that-is-too-long-to-be-displayed-in-the-ui.unitypackage',
        absolutePath: './example-path/example-file.unitypackage',
      },
    ],
  },
}
