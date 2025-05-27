import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLocalization } from '@/hooks/use-localization'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MemoInput } from './MemoInput'
import { DependencyInput } from './DependencyInput'
import { FC } from 'react'
import { AssetSummary, Result } from '@/lib/bindings'

export type CommonProps = {
  tabIndex: {
    current: number
    total: number
  }
  assetSummaries: AssetSummary[]
  assetMemo: {
    value: string
    setValue: (value: string) => void
  }
  assetDependencies: {
    value: string[]
    setValue: (value: string[]) => void
  }
  searchAssetsByText: (text: string) => Promise<Result<string[], string>>
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
  submit: () => Promise<void>
  submitInProgress: boolean
  previousTab: () => void
}

export type AddProps = {
  type: 'add'
  preference: {
    deleteSource: boolean
    setDeleteSource: (value: boolean) => Promise<void>
  }
} & CommonProps

export type EditProps = {
  type: 'edit'
} & CommonProps

export const AssetFormSecondInputTab: FC<AddProps | EditProps> = (props) => {
  if (props.type === 'add') {
    return <AssetFormSecondInputTabForAdd {...props} />
  } else if (props.type === 'edit') {
    return <AssetFormSecondInputTabForEdit {...props} />
  }
}

const AssetFormSecondInputTabForAdd: FC<AddProps> = ({
  tabIndex,
  assetSummaries,
  assetMemo,
  assetDependencies,
  preference,
  searchAssetsByText,
  resolveImageAbsolutePath,
  submit,
  submitInProgress,
  previousTab,
}) => {
  const { t } = useLocalization()

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:additional-input')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:additional-input:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <MemoInput memo={assetMemo.value} setMemo={assetMemo.setValue} />
        <DependencyInput
          dependencies={assetDependencies.value}
          setDependencies={assetDependencies.setValue}
          assetSummaries={assetSummaries}
          searchAssetsByText={searchAssetsByText}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
        />

        <div className="w-full flex justify-between">
          <Button
            variant="outline"
            onClick={previousTab}
            disabled={submitInProgress}
          >
            {t('general:button:back')}
          </Button>
          <div className="flex flex-row">
            <div className="flex items-center mr-4">
              <Checkbox
                className="cursor-pointer disabled:cursor-not-allowed"
                checked={preference!.deleteSource}
                onCheckedChange={preference!.setDeleteSource}
                disabled={submitInProgress}
              />
              <Label
                className="ml-2 cursor-pointer"
                onClick={() =>
                  preference!.setDeleteSource(!preference!.deleteSource)
                }
              >
                {t('addasset:additional-input:delete-source')}
              </Label>
            </div>
            <Button disabled={submitInProgress} onClick={submit}>
              {submitInProgress && <Loader2 className="animate-spin" />}
              {t('addasset:add-asset')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const AssetFormSecondInputTabForEdit: FC<EditProps> = ({
  tabIndex,
  assetSummaries,
  assetMemo,
  assetDependencies,
  searchAssetsByText,
  resolveImageAbsolutePath,
  submit,
  submitInProgress,
  previousTab,
}) => {
  const { t } = useLocalization()

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:additional-input')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:additional-input:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <MemoInput memo={assetMemo.value} setMemo={assetMemo.setValue} />
        <DependencyInput
          dependencies={assetDependencies.value}
          setDependencies={assetDependencies.setValue}
          assetSummaries={assetSummaries}
          searchAssetsByText={searchAssetsByText}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
        />

        <div className="w-full flex justify-between">
          <Button
            variant="outline"
            onClick={previousTab}
            disabled={submitInProgress}
          >
            {t('general:button:back')}
          </Button>
          <div className="flex flex-row">
            <Button disabled={submitInProgress} onClick={submit}>
              {submitInProgress && <Loader2 className="animate-spin" />}
              {t('addasset:update-asset')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
