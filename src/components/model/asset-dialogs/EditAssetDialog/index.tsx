import { TabsContent } from '@/components/ui/tabs'
import ManualInputTab from '../components/tabs/ManualInputTab'
import useEditAssetDialog from './hook'
import DialogWrapper from '../components/DialogWrapper'
import { Loader2 } from 'lucide-react'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import BoothInputTabForEditDialog from '../components/tabs/BoothInputTab/edit'

type Props = {
  id: string | null
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

const EditAssetDialog = ({ id, dialogOpen, setDialogOpen }: Props) => {
  const {
    loadingAssetData,
    form,
    tab,
    setTab,
    imageUrls,
    setImageUrls,
    backToPreviousTab,
    onSubmit,
    submitting,
  } = useEditAssetDialog({
    id,
    dialogOpen,
    setDialogOpen,
  })

  return (
    <DialogWrapper
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      tab={loadingAssetData ? 'loading' : tab}
      setTab={setTab}
      hideTrigger
    >
      <TabsContent value="loading">
        <DialogTitle>アセットをロード中...</DialogTitle>
        <DialogDescription>しばらくお待ちください...</DialogDescription>
        <Loader2 size={64} className="animate-spin" />
      </TabsContent>
      <TabsContent value="booth-input">
        <BoothInputTabForEditDialog
          form={form}
          closeDialog={() => setDialogOpen(false)}
          goToNextTab={() => setTab('manual-input')}
          setImageUrls={setImageUrls}
        />
      </TabsContent>
      <TabsContent value="manual-input">
        <ManualInputTab
          form={form}
          imageUrls={imageUrls}
          onBackToPreviousTabClicked={backToPreviousTab}
          onSubmit={onSubmit}
          submitting={submitting}
          tabIndex={2}
          totalTabs={2}
          hideDeleteSourceCheckbox
          submitButtonText="アセットを更新"
        />
      </TabsContent>
    </DialogWrapper>
  )
}

export default EditAssetDialog
