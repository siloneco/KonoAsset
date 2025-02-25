import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useContext } from 'react'
import { AddAssetDialogContext } from '../../../AddAssetDialog'
import { OctagonAlert } from 'lucide-react'
import SlimAssetDetail from '@/components/model/SlimAssetDetail'
import { useLocalization } from '@/hooks/use-localization'
type Props = {
  setTab: (tab: string) => void
  openEditDialog: (assetId: string) => void

  tabIndex: number
  totalTabs: number
}

const DuplicateWarningTab = ({ setTab, openEditDialog }: Props) => {
  const { t } = useLocalization()
  const { duplicateWarningItems } = useContext(AddAssetDialogContext)

  const moveToPreviousTab = () => {
    setTab('booth-input')
  }

  const moveToNextTab = () => {
    setTab('asset-type-selector')
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>(2.5/4) {t('addasset:duplicate-warning')} </DialogTitle>
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
            <SlimAssetDetail
              asset={item}
              openEditDialog={openEditDialog}
              className="max-w-[600px]"
            />
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

export default DuplicateWarningTab
