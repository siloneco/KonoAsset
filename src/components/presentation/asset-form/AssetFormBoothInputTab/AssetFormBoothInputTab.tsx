import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'
import { BoothAssetInfo, Result } from '@/lib/bindings'
import { ChevronRight, Loader2 } from 'lucide-react'
import { FC } from 'react'
import { useAssetFormBoothInputTab } from './hook'
import { BOOTH_INPUT_PLACEHOLDER } from './AssetFormBoothInputTab.constants'

export type CommonProps = {
  tabIndex: {
    current: number
    total: number
  }
  fetchBoothInformation: (
    boothItemId: number,
  ) => Promise<Result<BoothAssetInfo, string>>
  setBoothInformation: (boothInformation: BoothAssetInfo) => void
  nextTab: () => void
}

export type AddProps = {
  type: 'add'
  filenames: string[]
  checkDuplicateAsset: (
    boothItemId: number,
  ) => Promise<'ok' | 'movedToDuplicateTab'>
  previousTab: () => void
} & CommonProps

export type EditProps = {
  type: 'edit'
} & CommonProps

export const AssetFormBoothInputTab: FC<AddProps | EditProps> = (props) => {
  if (props.type === 'add') {
    return <AddTab {...props} />
  } else if (props.type === 'edit') {
    return <EditTab {...props} />
  }
}

const AddTab: FC<AddProps> = ({
  tabIndex,
  filenames,
  fetchBoothInformation,
  checkDuplicateAsset,
  setBoothInformation,
  nextTab,
  previousTab,
}) => {
  const { t } = useLocalization()
  const {
    urlInput,
    setUrlInput,
    representativeItemFilename,
    itemCount,
    fetching,
    fetchButtonDisabled,
    onFetchButtonClick,
  } = useAssetFormBoothInputTab({
    filenames,
    fetchBoothInformation,
    checkDuplicateAsset,
    setBoothInformation,
    nextTab,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:booth-input')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:booth-input:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        <div className="flex justify-center">
          <p className="space-x-2">
            <span className="text-muted-foreground">
              {t('addasset:booth-input:representative-file')}
            </span>
            <span>{representativeItemFilename}</span>
            {itemCount > 1 && (
              <span className="text-muted-foreground">
                {t('addasset:booth-input:multi-import:foretext')}
                {itemCount - 1}
                {t('addasset:booth-input:multi-import:posttext')}
              </span>
            )}
          </p>
        </div>
        <div>
          <Label className="text-base ml-1">
            {t('addasset:booth-input:get-info')}
          </Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder={BOOTH_INPUT_PLACEHOLDER}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={fetching}
            />
            <Button
              disabled={fetchButtonDisabled}
              onClick={onFetchButtonClick}
              className="h-10 gap-1"
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
            onClick={nextTab}
          >
            {t('addasset:booth-input:manual-input')}
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" className="mr-auto" onClick={previousTab}>
          {t('general:button:back')}
        </Button>
      </DialogFooter>
    </>
  )
}

const EditTab: FC<EditProps> = ({
  tabIndex,
  fetchBoothInformation,
  setBoothInformation,
  nextTab,
}) => {
  const { t } = useLocalization()
  const {
    urlInput,
    setUrlInput,
    fetching,
    fetchButtonDisabled,
    onFetchButtonClick,
  } = useAssetFormBoothInputTab({
    fetchBoothInformation,
    setBoothInformation,
    nextTab,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:booth-edit')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:booth-edit:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 space-y-6">
        <div>
          <Label className="text-base ml-1">
            {t('addasset:booth-edit:overwrite')}
          </Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder={BOOTH_INPUT_PLACEHOLDER}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={fetching}
            />
            <Button
              disabled={fetchButtonDisabled}
              onClick={onFetchButtonClick}
              className="h-10 gap-1"
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
            onClick={nextTab}
          >
            {t('addasset:booth-edit:do-not-change')}
          </Button>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="mr-auto">
            {t('general:button:cancel')}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
