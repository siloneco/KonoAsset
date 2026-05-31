import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCallback, useContext } from 'react'
import { AddAssetDialogContext } from '../../../AddAssetDialog'
import { Download, OctagonAlert } from 'lucide-react'
import { SlimAssetDetail } from '@/components/model-legacy/SlimAssetDetail'
import { useLocalization } from '@/hooks/use-localization'
import { useDataManagementDialogStore } from '@/stores/dialogs/DataManagementDialogStore'
type Props = {
  setTab: (tab: string) => void

  tabIndex: number
  totalTabs: number

  closeDialog: () => void
}

export const DuplicateWarningTab = ({
  setTab,
  tabIndex,
  totalTabs,
  closeDialog,
}: Props) => {
  const { t } = useLocalization()
  const { assetPaths, duplicateWarningItems } = useContext(
    AddAssetDialogContext,
  )

  const { open: openDataManagementDialog, importItems } =
    useDataManagementDialogStore()

  const importEntriesAs = useCallback(
    async (assetId: string) => {
      if (!assetPaths || assetPaths.length === 0) {
        return
      }

      closeDialog()
      openDataManagementDialog(assetId)

      await importItems(assetPaths)
    },
    [assetPaths, openDataManagementDialog, importItems, closeDialog],
  )

  const moveToPreviousTab = () => setTab('booth-input')
  const moveToNextTab = () => setTab('asset-type-selector')

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
              <Button onClick={() => importEntriesAs(item.id)}>
                <Download />
                {t('addasset:duplicate-warning:import-here')}
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
