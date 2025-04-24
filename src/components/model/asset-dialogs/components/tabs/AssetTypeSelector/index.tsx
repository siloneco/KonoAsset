import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import SelectTypeButton from './selector/SelectTypeButton'
import { AssetFormType } from '@/lib/form'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  form: AssetFormType
  setTab: (tab: string) => void

  tabIndex: number
  totalTabs: number
}

const AssetTypeSelectorTab = ({ form, setTab, tabIndex, totalTabs }: Props) => {
  const { t } = useLocalization()
  const backToBoothInput = () => {
    setTab('booth-input')
  }

  const moveToManualInputTab = () => {
    setTab('manual-input')
  }

  const assetType = form.watch('assetType')

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) {t('addasset:select-type')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:select-type:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6 flex flex-col items-center">
        <SelectTypeButton
          text={t('general:typeavatar')}
          onClick={() => {
            form.setValue('assetType', 'Avatar')
          }}
          selected={assetType === 'Avatar'}
        />
        <SelectTypeButton
          text={t('addasset:select-type:avatar-wearable')}
          onClick={() => {
            form.setValue('assetType', 'AvatarWearable')
          }}
          selected={assetType === 'AvatarWearable'}
        />
        <SelectTypeButton
          text={t('general:typeworldobject')}
          onClick={() => {
            form.setValue('assetType', 'WorldObject')
          }}
          selected={assetType === 'WorldObject'}
        />
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          className="mr-auto"
          onClick={backToBoothInput}
        >
          {t('general:button:back')}
        </Button>
        <Button onClick={moveToManualInputTab}>
          {t('general:button:next')}
        </Button>
      </DialogFooter>
    </>
  )
}

export default AssetTypeSelectorTab
