import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight, Loader2 } from 'lucide-react'
import { AssetFormType } from '@/lib/form'
import { useBoothInputTabForEditDialog } from './hook'
import { isBoothURL } from '@/lib/utils'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  form: AssetFormType
  closeDialog: () => void
  goToNextTab: () => void
  setImageUrls: (imageUrls: string[]) => void

  tabIndex: number
  totalTabs: number
}

const BoothInputTabForEditDialog = ({
  form,
  closeDialog,
  goToNextTab,
  setImageUrls,
  tabIndex,
  totalTabs,
}: Props) => {
  const { t } = useLocalization()
  const {
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
  } = useBoothInputTabForEditDialog({
    form,
    goToNextTab,
    setImageUrls,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) {t('addasset:booth-edit')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:booth-edit:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div>
          <Label className="text-base ml-1">
            {' '}
            {t('addasset:booth-edit:overwrite')}{' '}
          </Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder="https://booth.pm/ja/items/6641548"
              value={boothUrlInput}
              onChange={onUrlInputChange}
              disabled={fetching}
            />
            <Button
              disabled={fetching || !isBoothURL(boothUrlInput)}
              onClick={() => getAssetDescriptionFromBooth()}
            >
              {!fetching && <ChevronRight size={16} />}
              {fetching && <Loader2 size={16} className="animate-spin" />}
              {t('addasset:booth-input:button-text')}
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center"> {t('general:or')} </div>
        <div className="flex justify-center">
          <Button
            className="block w-48 h-12"
            variant={'outline'}
            onClick={goToNextTab}
          >
            {t('addasset:booth-edit:do-not-change')}
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" className="mr-auto" onClick={closeDialog}>
          {t('general:button:cancel')}
        </Button>
      </DialogFooter>
    </>
  )
}

export default BoothInputTabForEditDialog
