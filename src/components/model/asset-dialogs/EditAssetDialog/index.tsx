import { TabsContent } from '@/components/ui/tabs'
import { ManualInputTab } from '../components/tabs/ManualInputTab'
import { useEditAssetDialog } from './hook'
import { DialogWrapper } from '../components/DialogWrapper'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { BoothInputTabForEditDialog } from '../components/tabs/BoothInputTab/edit'
import { AdditionalInputTab } from '../components/tabs/AdditionalInputTab'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  id: string | null
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

export const EditAssetDialog = ({ id, dialogOpen, setDialogOpen }: Props) => {
  const {
    loadingAssetData,
    form,
    tab,
    setTab,
    imageUrls,
    setImageUrls,
    onSubmit,
    submitting,
  } = useEditAssetDialog({
    id,
    dialogOpen,
    setDialogOpen,
  })

  const { t } = useLocalization()

  return (
    <DialogWrapper
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      tab={loadingAssetData ? 'loading' : tab}
      setTab={setTab}
      hideTrigger
    >
      <TabsContent value="loading">
        <DialogTitle>
          <Skeleton className="w-72 h-4 rounded-sm" />
        </DialogTitle>
        <DialogDescription>
          <Skeleton className="mt-2 w-52 h-4 rounded-sm" />
        </DialogDescription>
        <Skeleton className="mt-8 w-32 h-4 rounded-sm" />
        <Skeleton className="mt-2 w-full h-8 rounded-sm" />
        <Skeleton className="mt-6 mx-auto w-24 h-10 rounded-sm" />
        <Skeleton className="mt-4 w-20 h-8 rounded-sm" />
      </TabsContent>
      <TabsContent value="booth-input">
        <BoothInputTabForEditDialog
          form={form}
          closeDialog={() => setDialogOpen(false)}
          goToNextTab={() => setTab('manual-input')}
          setImageUrls={setImageUrls}
          tabIndex={1}
          totalTabs={3}
        />
      </TabsContent>
      <TabsContent value="manual-input">
        <ManualInputTab
          form={form}
          imageUrls={imageUrls}
          onBackToPreviousTabClicked={() => setTab('booth-input')}
          onGoToNextTabClicked={() => setTab('additional-input')}
          tabIndex={2}
          totalTabs={3}
        />
      </TabsContent>
      <TabsContent value="additional-input">
        <AdditionalInputTab
          form={form}
          onBackToPreviousTabClicked={() => setTab('manual-input')}
          onSubmit={onSubmit}
          submitting={submitting}
          tabIndex={3}
          totalTabs={3}
          hideDeleteSourceCheckbox
          submitButtonText={t('addasset:update-asset')}
        />
      </TabsContent>
    </DialogWrapper>
  )
}
