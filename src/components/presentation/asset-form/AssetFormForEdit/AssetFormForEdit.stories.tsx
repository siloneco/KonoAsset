import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ComponentProps, FC, useCallback, useState } from 'react'
import { AssetType, BoothAssetInfo, Result } from '@/lib/bindings'
import { Option } from '@/components/ui/multi-select'
import { AssetFormForEdit } from './AssetFormForEdit'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'asset-form/AssetFormForEdit',
  component: AssetFormForEdit,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    dialogOpen: { control: 'boolean' },
    setDialogOpen: { action: 'setDialogOpen' },
    assetSummaries: { control: 'object' },
    assetSubmissionData: { control: 'object' },
    fetchBoothInformation: { action: 'fetchBoothInformation' },
    downloadImageFromUrl: { action: 'downloadImageFromUrl' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
    searchAssetsByText: { action: 'searchAssetsByText' },
    submit: { action: 'submit' },
    submitInProgress: { control: 'boolean' },
  },
  args: {
    dialogOpen: false,
    setDialogOpen: fn(),
    assetSummaries: [],
    assetSubmissionData: {
      type: 'AvatarWearable',
      image: {
        value: null,
        setValue: fn(),
      },
      name: {
        value: 'Asset Name',
        setValue: fn(),
      },
      creator: {
        value: 'Asset Creator',
        setValue: fn(),
      },
      tags: {
        value: [],
        setValue: fn(),
        getCandidates: fn(),
      },
      category: {
        value: null,
        setValue: fn(),
        getCandidates: fn(),
      },
      supportedAvatars: {
        value: [],
        setValue: fn(),
        getCandidates: fn(),
      },
      assetMemo: {
        value: '',
        setValue: fn(),
      },
      assetDependencies: {
        value: [],
        setValue: fn(),
      },
      resetAll: fn(),
    },
    fetchBoothInformation: fn(),
    downloadImageFromUrl: fn(),
    resolveImageAbsolutePath: fn(),
    searchAssetsByText: fn(),
    submit: fn(),
    submitInProgress: false,
  },
  render: (args) => <MockComponent {...args} />,
} satisfies Meta<typeof AssetFormForEdit>

export default meta
type Story = StoryObj<typeof meta>

export const Avatar: Story = {
  args: {
    assetSubmissionData: {
      ...meta.args.assetSubmissionData,
      type: 'Avatar',
    },
  },
}

export const AvatarWearable: Story = {
  args: {
    assetSubmissionData: {
      ...meta.args.assetSubmissionData,
      type: 'AvatarWearable',
    },
  },
}

export const WorldObject: Story = {
  args: {
    assetSubmissionData: {
      ...meta.args.assetSubmissionData,
      type: 'WorldObject',
    },
  },
}

const MockComponent: FC<ComponentProps<typeof AssetFormForEdit>> = (props) => {
  const [dialogOpen, setDialogOpen] = useState(props.dialogOpen)

  const [name, setName] = useState(props.assetSubmissionData.name.value)
  const [creator, setCreator] = useState(
    props.assetSubmissionData.creator.value,
  )
  const [tags, setTags] = useState(props.assetSubmissionData.tags.value)
  const [category, setCategory] = useState(
    props.assetSubmissionData.category.value,
  )
  const [supportedAvatars, setSupportedAvatars] = useState(
    props.assetSubmissionData.supportedAvatars.value,
  )
  const [assetMemo, setAssetMemo] = useState(
    props.assetSubmissionData.assetMemo.value,
  )
  const [assetDependencies, setAssetDependencies] = useState(
    props.assetSubmissionData.assetDependencies.value,
  )

  const [submitInProgress, setSubmitInProgress] = useState(false)

  const propsFetchBoothInformation = props.fetchBoothInformation
  const fetchBoothInformation = useCallback(
    async (boothItemId: number): Promise<Result<BoothAssetInfo, string>> => {
      propsFetchBoothInformation(boothItemId)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        status: 'ok',
        data: {
          id: boothItemId,
          name: 'Test Booth',
          creator: 'Test Creator',
          imageUrls: [],
          estimatedAssetType: 'AvatarWearable',
          publishedAt: 123,
        },
      }
    },
    [propsFetchBoothInformation],
  )

  const propsGetCategoryCandidates =
    props.assetSubmissionData.category.getCandidates
  const getCategoryCandidates = useCallback(
    async (type: Omit<AssetType, 'Avatar'>): Promise<Option[]> => {
      propsGetCategoryCandidates(type)
      return Promise.resolve([])
    },
    [propsGetCategoryCandidates],
  )

  const propsGetTagCandidates = props.assetSubmissionData.tags.getCandidates
  const getTagCandidates = useCallback(
    async (type: AssetType): Promise<Option[]> => {
      propsGetTagCandidates(type)
      return Promise.resolve([])
    },
    [propsGetTagCandidates],
  )

  const propsGetSupportedAvatarsCandidates =
    props.assetSubmissionData.supportedAvatars.getCandidates
  const getSupportedAvatarsCandidates = useCallback(async (): Promise<
    Option[]
  > => {
    propsGetSupportedAvatarsCandidates()
    return Promise.resolve([])
  }, [propsGetSupportedAvatarsCandidates])

  const propsResetAll = props.assetSubmissionData.resetAll
  const resetAll = useCallback(() => {
    propsResetAll()
    setName(props.assetSubmissionData.name.value)
    setCreator(props.assetSubmissionData.creator.value)
    setTags(props.assetSubmissionData.tags.value)
    setCategory(props.assetSubmissionData.category.value)
    setSupportedAvatars(props.assetSubmissionData.supportedAvatars.value)
    setAssetMemo(props.assetSubmissionData.assetMemo.value)
    setAssetDependencies(props.assetSubmissionData.assetDependencies.value)
  }, [
    propsResetAll,
    props.assetSubmissionData.name.value,
    props.assetSubmissionData.creator.value,
    props.assetSubmissionData.tags.value,
    props.assetSubmissionData.category.value,
    props.assetSubmissionData.supportedAvatars.value,
    props.assetSubmissionData.assetMemo.value,
    props.assetSubmissionData.assetDependencies.value,
  ])

  const propsSubmit = props.submit
  const mockSubmit = useCallback(async () => {
    propsSubmit()
    setSubmitInProgress(true)
    setTimeout(() => {
      setDialogOpen(false)
      setSubmitInProgress(false)
    }, 1000)
  }, [propsSubmit, setSubmitInProgress, setDialogOpen])

  return (
    <div>
      <Button onClick={() => setDialogOpen(true)}>
        Open Dialog (Only exists for Stories)
      </Button>
      <AssetFormForEdit
        {...props}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        fetchBoothInformation={fetchBoothInformation}
        assetSubmissionData={{
          ...props.assetSubmissionData,
          name: { value: name, setValue: setName },
          creator: { value: creator, setValue: setCreator },
          tags: {
            value: tags,
            setValue: setTags,
            getCandidates: getTagCandidates,
          },
          category: {
            value: category,
            setValue: setCategory,
            getCandidates: getCategoryCandidates,
          },
          supportedAvatars: {
            value: supportedAvatars,
            setValue: setSupportedAvatars,
            getCandidates: getSupportedAvatarsCandidates,
          },
          assetMemo: { value: assetMemo, setValue: setAssetMemo },
          assetDependencies: {
            value: assetDependencies,
            setValue: setAssetDependencies,
          },
          resetAll,
        }}
        submit={mockSubmit}
        submitInProgress={submitInProgress}
      />
    </div>
  )
}
