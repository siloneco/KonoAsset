import { TabsContent } from '@/components/ui/tabs'
import { createContext } from 'react'
import AssetPathSelectorTab from '../components/tabs/AssetPathSelectorTab'
import BoothInputTabForAddDialog from '../components/tabs/BoothInputTab/add'
import ManualInputTab from '../components/tabs/ManualInputTab'
import AssetTypeSelectorTab from '../components/tabs/AssetTypeSelector'
import DuplicateWarningTab from '../components/tabs/DuplicateWarningTab'
import { AssetSummary } from '@/lib/bindings'
import ProgressTab from '../components/tabs/ProgressTab'
import useAddAssetDialog from './hook'
import DialogWrapper from '../components/DialogWrapper'
import AdditionalInputTab from '../components/tabs/AdditionalInputTab'
import { useLocalization } from '@/hooks/use-localization'

export type AddAssetDialogContextType = {
  assetPaths?: string[]
  setAssetPaths: (paths: string[]) => void

  duplicateWarningItems: AssetSummary[]
  setDuplicateWarningItems: (items: AssetSummary[]) => void
}

export const AddAssetDialogContext = createContext<AddAssetDialogContextType>({
  setAssetPaths: () => {},

  duplicateWarningItems: [],
  setDuplicateWarningItems: () => {},
})

type Props = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  openEditDialog: (assetId: string) => void
}

const AddAssetDialog = ({
  dialogOpen,
  setDialogOpen,
  openEditDialog,
}: Props) => {
  const { t } = useLocalization()

  const {
    tab,
    setTab,
    contextValue,
    form,
    setImageUrls,
    imageUrls,
    importTaskId,
    onTaskCompleted,
    onTaskCancelled,
    onTaskFailed,
    onSubmit,
    submitting,
  } = useAddAssetDialog({ dialogOpen, setDialogOpen })

  return (
    <DialogWrapper
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      tab={tab}
      setTab={setTab}
      preventCloseOnOutsideClick
    >
      <AddAssetDialogContext.Provider value={contextValue}>
        <TabsContent value="selector">
          <AssetPathSelectorTab setTab={setTab} tabIndex={1} totalTabs={5} />
        </TabsContent>
        <TabsContent value="booth-input">
          <BoothInputTabForAddDialog
            form={form}
            setTab={setTab}
            setImageUrls={setImageUrls}
            tabIndex={2}
            totalTabs={5}
          />
        </TabsContent>
        <TabsContent value="duplicate-warning">
          <DuplicateWarningTab
            setTab={setTab}
            openEditDialog={openEditDialog}
            tabIndex={2.5}
            totalTabs={5}
          />
        </TabsContent>
        <TabsContent value="asset-type-selector">
          <AssetTypeSelectorTab
            form={form}
            setTab={setTab}
            tabIndex={3}
            totalTabs={5}
          />
        </TabsContent>
        <TabsContent value="manual-input">
          <ManualInputTab
            form={form}
            imageUrls={imageUrls}
            onBackToPreviousTabClicked={() => setTab('asset-type-selector')}
            onGoToNextTabClicked={() => setTab('additional-input')}
            tabIndex={4}
            totalTabs={5}
          />
        </TabsContent>
        <TabsContent value="additional-input">
          <AdditionalInputTab
            form={form}
            onBackToPreviousTabClicked={() => setTab('manual-input')}
            onSubmit={onSubmit}
            submitting={submitting}
            tabIndex={5}
            totalTabs={5}
            submitButtonText={t('addasset:add-asset')}
          />
        </TabsContent>
        <TabsContent value="progress">
          <ProgressTab
            taskId={importTaskId}
            onCompleted={onTaskCompleted}
            onCancelled={onTaskCancelled}
            onFailed={onTaskFailed}
          />
        </TabsContent>
      </AddAssetDialogContext.Provider>
    </DialogWrapper>
  )
}

export default AddAssetDialog
