import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'
import { AssetType } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { ChevronsRight } from 'lucide-react'

type Props = {
  tabIndex: {
    current: number
    total: number
  }
  assetType: AssetType
  setAssetType: (assetType: AssetType) => void
  nextTab: () => void
  previousTab: () => void
}

export const AssetFormTypeSelectTab: FC<Props> = ({
  tabIndex,
  assetType,
  setAssetType,
  nextTab,
  previousTab,
}) => {
  const { t } = useLocalization()

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:select-type')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:select-type:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 space-y-6 flex flex-col items-center">
        <SelectTypeButton
          text={t('general:typeavatar')}
          onClick={() => setAssetType('Avatar')}
          selected={assetType === 'Avatar'}
        />
        <SelectTypeButton
          text={t('addasset:select-type:avatar-wearable')}
          onClick={() => setAssetType('AvatarWearable')}
          selected={assetType === 'AvatarWearable'}
        />
        <SelectTypeButton
          text={t('general:typeworldobject')}
          onClick={() => setAssetType('WorldObject')}
          selected={assetType === 'WorldObject'}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" className="mr-auto" onClick={previousTab}>
          {t('general:button:back')}
        </Button>
        <Button onClick={nextTab}>{t('general:button:next')}</Button>
      </DialogFooter>
    </>
  )
}

type SelectTypeButtonProps = {
  text: string
  onClick: () => void
  selected: boolean
}

export const SelectTypeButton: FC<SelectTypeButtonProps> = ({
  text,
  onClick,
  selected,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={'outline'}
      className={cn(
        'w-96 h-12 py-1',
        selected &&
          'border-2 border-ring dark:border-ring ring-ring/50 ring-[3px]',
      )}
    >
      <div className="w-3">
        {selected && <ChevronsRight className="text-primary" size={32} />}
      </div>
      {text}
    </Button>
  )
}
