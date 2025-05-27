import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AssetFormForAdd } from '.'
import { ComponentProps, FC, ReactNode, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { AssetSummary, AssetType, BoothAssetInfo, Result } from '@/lib/bindings'
import { Option } from '@/components/ui/multi-select'

const MockTanstackRouterLinkComponent: FC<{
  children: ReactNode
  className?: string
}> = ({ children, className }) => (
  <span className={cn('cursor-pointer', className)}>{children}</span>
)

const meta = {
  title: 'asset-form/AssetFormForAdd',
  component: AssetFormForAdd,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    dialogOpen: { control: 'boolean' },
    setDialogOpen: { action: 'setDialogOpen' },
    preference: { control: 'object' },
    assetSummaries: { control: 'object' },
    assetSubmissionData: { control: 'object' },
    openFileOrDirSelector: { action: 'openFileOrDirSelector' },
    fetchBoothInformation: { action: 'fetchBoothInformation' },
    getAssetSummariesByBoothId: { action: 'getAssetSummariesByBoothId' },
    downloadImageFromUrl: { action: 'downloadImageFromUrl' },
    resolveImageAbsolutePath: { action: 'resolveImageAbsolutePath' },
    openAssetManagedDir: { action: 'openAssetManagedDir' },
    openEditAssetDialog: { action: 'openEditAssetDialog' },
    openDirEditDialog: { action: 'openDirEditDialog' },
    searchAssetsByText: { action: 'searchAssetsByText' },
    getNonExistentPaths: { action: 'getNonExistentPaths' },
    submit: { action: 'submit' },
    submitProgress: { control: 'object' },
    TanstackRouterLinkComponent: { control: 'object' },
  },
  args: {
    dialogOpen: false,
    setDialogOpen: fn(),
    preference: {
      zipExtraction: false,
      deleteOnImport: false,
      setDeleteOnImport: fn(),
    },
    assetSummaries: [],
    assetSubmissionData: {
      items: {
        value: [],
        setValue: fn(),
      },
      type: {
        value: 'Avatar',
        setValue: fn(),
      },
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
    openFileOrDirSelector: fn(),
    fetchBoothInformation: fn(),
    getAssetSummariesByBoothId: fn(),
    downloadImageFromUrl: fn(),
    resolveImageAbsolutePath: fn(),
    openAssetManagedDir: fn(),
    openEditAssetDialog: fn(),
    openDirEditDialog: fn(),
    searchAssetsByText: fn(),
    getNonExistentPaths: fn(),
    submit: fn(),
    TanstackRouterLinkComponent: MockTanstackRouterLinkComponent,
  },
  render: (args) => <MockComponent {...args} />,
} satisfies Meta<typeof AssetFormForAdd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const MockComponent: FC<ComponentProps<typeof AssetFormForAdd>> = (props) => {
  const [dialogOpen, setDialogOpen] = useState(props.dialogOpen)

  const [items, setItems] = useState(props.assetSubmissionData.items.value)
  const [type, setType] = useState(props.assetSubmissionData.type.value)
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

  const [deleteOnImport, setDeleteOnImport] = useState(
    props.preference.deleteOnImport,
  )

  const [submitInProgress, setSubmitInProgress] = useState(false)
  const [progressBarValue, setProgressBarValue] = useState(0)

  const propsOpenFileOrDirSelector = props.openFileOrDirSelector
  const openFileOrDirSelector = useCallback(
    async (args: { type: 'file' | 'directory' }) => {
      propsOpenFileOrDirSelector(args)
      return Promise.resolve(['test.png'])
    },
    [propsOpenFileOrDirSelector],
  )

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

  const propsGetAssetSummariesByBoothId = props.getAssetSummariesByBoothId
  const getAssetSummariesByBoothId = useCallback(
    async (boothItemId: number): Promise<Result<AssetSummary[], string>> => {
      propsGetAssetSummariesByBoothId(boothItemId)

      return {
        status: 'ok',
        data: [],
      }
    },
    [propsGetAssetSummariesByBoothId],
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
    setItems(props.assetSubmissionData.items.value)
    setType(props.assetSubmissionData.type.value)
    setName(props.assetSubmissionData.name.value)
    setCreator(props.assetSubmissionData.creator.value)
    setTags(props.assetSubmissionData.tags.value)
    setCategory(props.assetSubmissionData.category.value)
    setSupportedAvatars(props.assetSubmissionData.supportedAvatars.value)
    setAssetMemo(props.assetSubmissionData.assetMemo.value)
    setAssetDependencies(props.assetSubmissionData.assetDependencies.value)
  }, [
    propsResetAll,
    props.assetSubmissionData.items.value,
    props.assetSubmissionData.type.value,
    props.assetSubmissionData.name.value,
    props.assetSubmissionData.creator.value,
    props.assetSubmissionData.tags.value,
    props.assetSubmissionData.category.value,
    props.assetSubmissionData.supportedAvatars.value,
    props.assetSubmissionData.assetMemo.value,
    props.assetSubmissionData.assetDependencies.value,
  ])

  const mockSubmitProgress = useCallback(() => {
    setSubmitInProgress(true)
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        setProgressBarValue(2 * i)
      }, 50 * i)
    }
    setTimeout(
      () => {
        setDialogOpen(false)
        setSubmitInProgress(false)
      },
      50 * 50 + 100,
    )
  }, [setSubmitInProgress, setDialogOpen])

  const propsGetNonExistentPaths = props.getNonExistentPaths
  const getNonExistentPaths = useCallback(
    async (paths: string[]): Promise<Result<string[], string>> => {
      propsGetNonExistentPaths(paths)
      mockSubmitProgress()
      return Promise.resolve({ status: 'ok', data: [] })
    },
    [propsGetNonExistentPaths, mockSubmitProgress],
  )

  return (
    <AssetFormForAdd
      {...props}
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      preference={{
        ...props.preference,
        deleteOnImport,
        setDeleteOnImport: async (deleteOnImport: boolean) => {
          await props.preference.setDeleteOnImport(deleteOnImport)
          setDeleteOnImport(deleteOnImport)
        },
      }}
      openFileOrDirSelector={openFileOrDirSelector}
      fetchBoothInformation={fetchBoothInformation}
      getAssetSummariesByBoothId={getAssetSummariesByBoothId}
      assetSubmissionData={{
        ...props.assetSubmissionData,
        items: { value: items, setValue: setItems },
        type: { value: type, setValue: setType },
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
      getNonExistentPaths={getNonExistentPaths}
      submitProgress={
        submitInProgress
          ? {
              filename: 'filename.dummy',
              progress: progressBarValue,
              cancel: async () => {},
            }
          : undefined
      }
    />
  )
}
