import { Tabs, TabsContent } from '@/components/ui/tabs'
import { AssetFormForEditDialogTabs, useAssetFormForEdit } from './hook'
import { FC } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { AssetSummary, AssetType, BoothAssetInfo, Result } from '@/lib/bindings'
import { AssetFormBoothInputTab } from '../AssetFormBoothInputTab'
import { AssetFormFirstInputTab } from '../AssetFormFirstInputTab'
import { AssetFormSecondInputTab } from '../AssetFormSecondInputTab'
import { Option } from '@/components/ui/multi-select'

export type AssetSubmissionData = {
  type: AssetType
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
  assetSummaries: AssetSummary[]
  assetSubmissionData: AssetSubmissionData
  fetchBoothInformation: (
    boothItemId: number,
  ) => Promise<Result<BoothAssetInfo, string>>
  downloadImageFromUrl: (url: string) => Promise<Result<string, string>>
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
  searchAssetsByText: (text: string) => Promise<Result<string[], string>>
  submit: () => Promise<void>
  submitInProgress: boolean
}

export const AssetFormForEdit: FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  assetSummaries,
  assetSubmissionData,
  fetchBoothInformation,
  resolveImageAbsolutePath,
  downloadImageFromUrl,
  searchAssetsByText,
  submit,
  submitInProgress,
}) => {
  const { tab, setTab, setBoothInformation, assetImage } = useAssetFormForEdit({
    dialogOpen,
    assetSubmissionData,
    downloadImageFromUrl,
    resolveImageAbsolutePath,
  })

  return (
    <DialogWrapper
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      tab={tab}
      setTab={setTab}
    >
      <TabsContent value="booth-input">
        <AssetFormBoothInputTab
          type="edit"
          tabIndex={{
            current: 1,
            total: 3,
          }}
          fetchBoothInformation={fetchBoothInformation}
          setBoothInformation={setBoothInformation}
          nextTab={() => setTab('first-input')}
        />
      </TabsContent>
      <TabsContent value="first-input">
        <AssetFormFirstInputTab
          tabIndex={{
            current: 2,
            total: 3,
          }}
          assetType={assetSubmissionData.type}
          assetImage={assetImage}
          assetName={assetSubmissionData.name}
          assetCreator={assetSubmissionData.creator}
          assetTags={assetSubmissionData.tags}
          assetCategory={assetSubmissionData.category}
          assetSupportedAvatars={assetSubmissionData.supportedAvatars}
          nextTab={() => setTab('second-input')}
          previousTab={() => setTab('booth-input')}
        />
      </TabsContent>
      <TabsContent value="second-input">
        <AssetFormSecondInputTab
          type="edit"
          tabIndex={{
            current: 3,
            total: 3,
          }}
          assetSummaries={assetSummaries}
          assetMemo={assetSubmissionData.assetMemo}
          assetDependencies={assetSubmissionData.assetDependencies}
          searchAssetsByText={searchAssetsByText}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
          submit={submit}
          submitInProgress={submitInProgress}
          previousTab={() => setTab('first-input')}
        />
      </TabsContent>
    </DialogWrapper>
  )
}

type DialogWrapperProps = {
  children: React.ReactNode
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  tab: string
  setTab: (tab: AssetFormForEditDialogTabs) => void
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
      <DialogContent
        className={cn(tab === 'progress' && '[&>button]:hidden')}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as AssetFormForEditDialogTabs)}
        >
          {children}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
