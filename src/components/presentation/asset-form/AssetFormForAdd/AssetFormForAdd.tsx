import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AssetFormForAddDialogTabs, useAssetFormForAdd } from './hook'
import { useLocalization } from '@/hooks/use-localization'
import { ComponentProps, FC, ReactNode } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  AssetSummary,
  AssetType,
  BoothAssetInfo,
  PreferenceStore,
  Result,
} from '@/lib/bindings'
import { AssetFormItemSelectTab } from '../AssetFormItemSelectTab'
import { AssetFormBoothInputTab } from '../AssetFormBoothInputTab'
import { AssetFormDuplicateWarningTab } from '../AssetFormDuplicateWarningTab'
import { AssetFormTypeSelectTab } from '../AssetFormTypeSelectTab'
import { AssetFormFirstInputTab } from '../AssetFormFirstInputTab'
import { AssetFormSecondInputTab } from '../AssetFormSecondInputTab'
import { AssetFormPathConfirmationTab } from '../AssetFormPathConfirmationTab'
import { TaskProgressDialogContent } from '../../task/TaskProgressDialogContent/TaskProgressDialogContent'
import { Option } from '@/components/ui/multi-select'

export type AssetSubmissionData = {
  items: {
    value: string[]
    setValue: (value: string[]) => void
  }
  type: {
    value: AssetType
    setValue: (value: AssetType) => void
  }
  image: {
    value: string | null
    setValue: (value: string | null) => void
  }
  name: {
    value: string
    setValue: (value: string) => void
  }
  creator: {
    value: string
    setValue: (value: string) => void
  }
  tags: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: (type: AssetType) => Promise<Option[]>
  }
  category: {
    value: string | null
    setValue: (value: string | null) => void
    getCandidates: (type: Omit<AssetType, 'Avatar'>) => Promise<Option[]>
  }
  supportedAvatars: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: () => Promise<Option[]>
  }
  assetMemo: {
    value: string
    setValue: (value: string) => void
  }
  assetDependencies: {
    value: string[]
    setValue: (value: string[]) => void
  }
  resetAll: () => void
}

type Props = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  preference: Pick<PreferenceStore, 'zipExtraction' | 'deleteOnImport'> & {
    setDeleteOnImport: (deleteOnImport: boolean) => Promise<void>
  }
  assetSummaries: AssetSummary[]
  assetSubmissionData: AssetSubmissionData
  openFileOrDirSelector: (
    type: 'file' | 'directory',
  ) => Promise<string[] | null>
  fetchBoothInformation: (
    boothItemId: number,
  ) => Promise<Result<BoothAssetInfo, string>>
  getAssetSummariesByBoothId: (
    boothItemId: number,
  ) => Promise<Result<AssetSummary[], string>>
  downloadImageFromUrl: (url: string) => Promise<Result<string, string>>
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
  openAssetManagedDir: (assetId: string) => Promise<void>
  openEditAssetDialog: (assetId: string) => Promise<void>
  openDirEditDialog: (assetId: string) => Promise<void>
  searchAssetsByText: (text: string) => Promise<Result<string[], string>>
  getNonExistentPaths: (paths: string[]) => Promise<Result<string[], string>>
  submit: () => Promise<void>
  submitProgress?: {
    filename: string
    progress: number
    cancel: () => Promise<void>
  }
  TanstackRouterLinkComponent?: FC<{ children: ReactNode; className?: string }>
}

export const AssetFormForAdd: FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  preference,
  assetSummaries,
  assetSubmissionData,
  openFileOrDirSelector,
  fetchBoothInformation,
  getAssetSummariesByBoothId,
  downloadImageFromUrl,
  resolveImageAbsolutePath,
  openAssetManagedDir,
  openEditAssetDialog,
  openDirEditDialog,
  searchAssetsByText,
  getNonExistentPaths,
  submit,
  submitProgress,
  TanstackRouterLinkComponent,
}) => {
  const { t } = useLocalization()

  const {
    tab,
    setTab,
    setBoothInformation,
    duplicateAssetSummaries,
    checkDuplicateAsset,
    onSubmitButtonClickInSecondInputTab,
    existentPaths,
    nonExistentPaths,
    assetImage,
  } = useAssetFormForAdd({
    dialogOpen,
    assetSubmissionData,
    getAssetSummariesByBoothId,
    downloadImageFromUrl,
    resolveImageAbsolutePath,
    getNonExistentPaths,
    submit,
  })

  return (
    <DialogWrapper
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      tab={tab}
      setTab={setTab}
    >
      <TabsContentWrapper value="item-selector" className={cn('grid gap-4')}>
        <AssetFormItemSelectTab
          tabIndex={{
            current: 1,
            total: 5,
          }}
          nextTab={() => setTab('booth-input')}
          zipExtraction={preference.zipExtraction}
          openFileOrDirSelector={openFileOrDirSelector}
          setItems={assetSubmissionData.items.setValue}
          TanstackRouterLinkComponent={TanstackRouterLinkComponent}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="booth-input">
        <AssetFormBoothInputTab
          type="add"
          tabIndex={{
            current: 2,
            total: 5,
          }}
          filenames={assetSubmissionData.items.value}
          fetchBoothInformation={fetchBoothInformation}
          checkDuplicateAsset={checkDuplicateAsset}
          setBoothInformation={setBoothInformation}
          nextTab={() => setTab('type-selector')}
          previousTab={() => setTab('item-selector')}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="duplicate-warning">
        <AssetFormDuplicateWarningTab
          tabIndex={{
            current: 2.5,
            total: 5,
          }}
          duplicateAssets={duplicateAssetSummaries}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
          openAssetManagedDir={openAssetManagedDir}
          openEditAssetDialog={openEditAssetDialog}
          openDirEditDialog={openDirEditDialog}
          nextTab={() => setTab('type-selector')}
          previousTab={() => setTab('booth-input')}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="type-selector">
        <AssetFormTypeSelectTab
          tabIndex={{
            current: 3,
            total: 5,
          }}
          assetType={assetSubmissionData.type.value}
          setAssetType={assetSubmissionData.type.setValue}
          nextTab={() => setTab('first-input')}
          previousTab={() => setTab('booth-input')}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="first-input">
        <AssetFormFirstInputTab
          tabIndex={{
            current: 4,
            total: 5,
          }}
          assetType={assetSubmissionData.type.value}
          assetImage={assetImage}
          assetName={assetSubmissionData.name}
          assetCreator={assetSubmissionData.creator}
          assetTags={assetSubmissionData.tags}
          assetCategory={assetSubmissionData.category}
          assetSupportedAvatars={assetSubmissionData.supportedAvatars}
          nextTab={() => setTab('second-input')}
          previousTab={() => setTab('type-selector')}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="second-input">
        <AssetFormSecondInputTab
          type="add"
          tabIndex={{
            current: 5,
            total: 5,
          }}
          assetSummaries={assetSummaries}
          assetMemo={assetSubmissionData.assetMemo}
          assetDependencies={assetSubmissionData.assetDependencies}
          preference={{
            deleteSource: preference.deleteOnImport,
            setDeleteSource: preference.setDeleteOnImport,
          }}
          searchAssetsByText={searchAssetsByText}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
          submit={onSubmitButtonClickInSecondInputTab}
          submitInProgress={submitProgress !== undefined}
          previousTab={() => setTab('first-input')}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="path-confirmation">
        <AssetFormPathConfirmationTab
          existingPaths={existentPaths}
          nonExistingPaths={nonExistentPaths}
          submit={submit}
          previousTab={() => setTab('second-input')}
        />
      </TabsContentWrapper>
      <TabsContentWrapper value="progress">
        <TaskProgressDialogContent
          title={t('addasset:progress-bar')}
          description=""
          message={submitProgress?.filename ?? ''}
          progress={submitProgress?.progress ?? 0}
          cancel={submitProgress?.cancel ?? (async () => {})}
        />
      </TabsContentWrapper>
    </DialogWrapper>
  )
}

type DialogWrapperProps = {
  children: React.ReactNode
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  tab: string
  setTab: (tab: AssetFormForAddDialogTabs) => void
}

const DialogWrapper: FC<DialogWrapperProps> = ({
  children,
  dialogOpen,
  setDialogOpen,
  tab,
  setTab,
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div>
          <div className="fixed size-16 rounded-full bg-background" />
          <Button className="fixed size-16 rounded-full">
            <Plus className="size-8" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className={cn(tab === 'progress' && '[&>button]:hidden')}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as AssetFormForAddDialogTabs)}
        >
          {children}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

const TabsContentWrapper: FC<ComponentProps<typeof TabsContent>> = (props) => {
  return (
    <TabsContent {...props} className={cn('grid gap-4', props.className)} />
  )
}
