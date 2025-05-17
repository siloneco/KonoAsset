import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useContext } from 'react'
import { AddAssetDialogContext } from '../../../AddAssetDialog'
import { Folder, OctagonAlert, Pencil } from 'lucide-react'
import { SlimAssetDetail } from '@/components/model/SlimAssetDetail'
import { useLocalization } from '@/hooks/use-localization'
import { commands } from '@/lib/bindings'
import { useToast } from '@/hooks/use-toast'
type Props = {
  setTab: (tab: string) => void
  openEditDialog: (assetId: string) => void
  openDataManagementDialog: (assetId: string) => void

  tabIndex: number
  totalTabs: number
}

export const DuplicateWarningTab = ({
  setTab,
  openEditDialog,
  openDataManagementDialog,
  tabIndex,
  totalTabs,
}: Props) => {
  const { t } = useLocalization()
  const { toast } = useToast()
  const { duplicateWarningItems } = useContext(AddAssetDialogContext)

  const openAsset = async (assetId: string) => {
    const result = await commands.openManagedDir(assetId)

    if (result.status === 'ok') {
      return
    }

    toast({
      title: t('general:failed'),
      description: result.error,
    })
  }

  const moveToPreviousTab = () => {
    setTab('booth-input')
  }

  const moveToNextTab = () => {
    setTab('asset-type-selector')
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) {t('addasset:duplicate-warning')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:duplicate-warning:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div className="flex flex-col items-center">
          <p className="flex flex-row">
            <OctagonAlert className="text-destructive mr-2" />
            {t('addasset:duplicate-warning:warning-text')}
          </p>
        </div>
      </div>
      <div>
        {duplicateWarningItems.map((item) => (
          <div key={item.id} className="mb-4">
            <SlimAssetDetail asset={item} className="max-w-[600px]">
              <Button onClick={() => openAsset(item.id)}>
                {t('general:button:open')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => openEditDialog(item.id)}
              >
                <Pencil />
              </Button>
              <Button
                variant="secondary"
                onClick={() => openDataManagementDialog(item.id)}
              >
                <Folder />
              </Button>
            </SlimAssetDetail>
          </div>
        ))}
      </div>
      <DialogFooter className="mt-8">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={moveToPreviousTab}
        >
          {t('general:button:back')}
        </Button>
        <Button variant="secondary" className="ml-auto" onClick={moveToNextTab}>
          {t('addasset:duplicate-warning:proceed')}
        </Button>
      </DialogFooter>
    </>
  )
}
