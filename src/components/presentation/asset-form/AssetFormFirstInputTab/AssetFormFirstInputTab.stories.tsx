import type { Meta, StoryObj } from '@storybook/react'
import { AssetFormFirstInputTab } from './AssetFormFirstInputTab'
import { fn } from '@storybook/test'
import { ComponentProps, FC, useCallback, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const MockAssetFormFirstInputTab: FC<
  ComponentProps<typeof AssetFormFirstInputTab>
> = (args) => {
  const [name, setName] = useState<string>(args.assetName.value)
  const [creator, setCreator] = useState<string>(args.assetCreator.value)
  const [tags, setTags] = useState<string[]>(args.assetTags.value)
  const [category, setCategory] = useState<string | null>(
    args.assetCategory?.value ?? null,
  )
  const [supportedAvatars, setSupportedAvatars] = useState<string[]>(
    args.assetSupportedAvatars?.value ?? [],
  )

  const [imageIndex, setImageIndex] = useState<number>(
    args.assetImage.indexSelector?.index ?? 0,
  )

  const providedAssetTagSetter = args.assetTags.setValue
  const providedAssetCategorySetter = args.assetCategory?.setValue
  const providedAssetSupportedAvatarsSetter =
    args.assetSupportedAvatars?.setValue

  const assetTagSetter = useCallback(
    (value: string[]) => {
      providedAssetTagSetter(value)
      setTags(value)
    },
    [providedAssetTagSetter, setTags],
  )

  const assetCategorySetter = useCallback(
    (value: string | null) => {
      providedAssetCategorySetter?.(value)
      setCategory(value)
    },
    [providedAssetCategorySetter, setCategory],
  )

  const assetSupportedAvatarsSetter = useCallback(
    (value: string[]) => {
      providedAssetSupportedAvatarsSetter?.(value)
      setSupportedAvatars(value)
    },
    [providedAssetSupportedAvatarsSetter, setSupportedAvatars],
  )

  const getAssetTagCandidates = useCallback(async () => {
    return Promise.resolve(
      ['Tag1', 'Tag2', 'Tag3'].map((item) => {
        return {
          value: item,
          label: item,
        }
      }),
    )
  }, [])

  const getAssetCategoryCandidates = useCallback(async () => {
    return Promise.resolve(
      ['Category1', 'Category2', 'Category3'].map((item) => {
        return {
          value: item,
          label: item,
        }
      }),
    )
  }, [])

  const getAssetSupportedAvatarCandidates = useCallback(async () => {
    return Promise.resolve(
      ['Avatar1', 'Avatar2', 'Avatar3'].map((item) => {
        return {
          value: item,
          label: item,
        }
      }),
    )
  }, [])

  const mockSetImageIndex = useCallback(
    (index: number) => {
      setImageIndex(index)
    },
    [setImageIndex],
  )

  return (
    <AssetFormFirstInputTab
      {...args}
      assetImage={{
        ...args.assetImage,
        indexSelector: {
          index: imageIndex,
          maxIndex: args.assetImage.indexSelector?.maxIndex ?? 5,
          setIndex: mockSetImageIndex,
        },
      }}
      assetName={{ value: name, setValue: setName }}
      assetCreator={{ value: creator, setValue: setCreator }}
      assetTags={{
        value: tags,
        setValue: assetTagSetter,
        getCandidates: getAssetTagCandidates,
      }}
      assetCategory={{
        value: category,
        setValue: assetCategorySetter,
        getCandidates: getAssetCategoryCandidates,
      }}
      assetSupportedAvatars={{
        value: supportedAvatars,
        setValue: assetSupportedAvatarsSetter,
        getCandidates: getAssetSupportedAvatarCandidates,
      }}
    />
  )
}

const meta = {
  title: 'asset-form/Components/AssetFormFirstInputTab',
  component: AssetFormFirstInputTab,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    tabIndex: { control: 'object' },
    assetType: {
      control: 'select',
      options: ['Avatar', 'AvatarWearable', 'WorldObject'],
    },
    assetImage: { control: 'object' },
    assetName: { control: 'text' },
    assetCreator: { control: 'text' },
    assetTags: { control: 'object' },
    assetCategory: { control: 'object' },
    assetSupportedAvatars: { control: 'object' },
    nextTab: { action: 'nextTab' },
    previousTab: { action: 'previousTab' },
  },
  args: {
    tabIndex: { current: 1, total: 5 },
    assetImage: {
      loading: false,
      indexSelector: { index: 0, maxIndex: 4, setIndex: fn() },
      userImageProvider: {
        onImagePathProvided: fn(),
        openImagePathSelector: fn(),
      },
    },
    assetName: { value: 'Asset Name', setValue: fn() },
    assetCreator: { value: 'Asset Creator', setValue: fn() },
    assetTags: {
      value: ['Tag1', 'Tag2', 'Tag3'],
      setValue: fn(),
      getCandidates: fn(),
    },
    assetCategory: { value: 'Category', setValue: fn(), getCandidates: fn() },
    assetSupportedAvatars: {
      value: ['Avatar1', 'Avatar2', 'Avatar3'],
      setValue: fn(),
      getCandidates: fn(),
    },
    nextTab: fn(),
    previousTab: fn(),
  },
  render: (args) => <MockAssetFormFirstInputTab {...args} />,
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <DialogContent>
          <Story />
        </DialogContent>
      </Dialog>
    ),
  ],
} satisfies Meta<typeof AssetFormFirstInputTab>

export default meta
type Story = StoryObj<typeof meta>

export const Avatar: Story = {
  args: {
    assetType: 'Avatar',
  },
}

export const AvatarWearable: Story = {
  args: {
    assetType: 'AvatarWearable',
  },
}

export const WorldObject: Story = {
  args: {
    assetType: 'WorldObject',
  },
}
