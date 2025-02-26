import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLocalization } from '@/hooks/use-localization'
import { Loader2 } from 'lucide-react'
import { useAdditionalInputTab } from './hook'
import { AssetFormType } from '@/lib/form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MemoInput } from './components/MemoInput'
import { DependencyInput } from './components/DependencyInput'

type Props = {
  form: AssetFormType
  onBackToPreviousTabClicked: () => void
  onSubmit: () => Promise<void>
  submitting: boolean

  tabIndex: number
  totalTabs: number

  hideDeleteSourceCheckbox?: boolean
  submitButtonText: string
}

const AdditionalInputTab = ({
  form,
  onBackToPreviousTabClicked,
  onSubmit,
  submitting,

  tabIndex,
  totalTabs,

  hideDeleteSourceCheckbox = false,
  submitButtonText,
}: Props) => {
  const { t } = useLocalization()

  const {
    memo,
    setMemo,
    dependencies,
    setDependencies,
    deleteSourceChecked,
    setDeleteSourceChecked,
  } = useAdditionalInputTab({ form })

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) {t('addasset:additional-input')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:additional-input:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <MemoInput memo={memo ?? ''} setMemo={setMemo} />
        <DependencyInput
          dependencies={dependencies}
          setDependencies={setDependencies}
        />

        <div className="w-full flex justify-between">
          <Button
            variant="outline"
            onClick={onBackToPreviousTabClicked}
            disabled={submitting}
          >
            {t('general:button:back')}
          </Button>
          <div className="flex flex-row">
            {!hideDeleteSourceCheckbox && (
              <div className="flex items-center mr-4">
                <Checkbox
                  checked={deleteSourceChecked}
                  onCheckedChange={setDeleteSourceChecked}
                  disabled={submitting}
                />
                <Label
                  className="ml-2"
                  onClick={() => setDeleteSourceChecked(!deleteSourceChecked)}
                >
                  {t('addasset:additional-input:delete-source')}
                </Label>
              </div>
            )}
            <Button disabled={submitting} onClick={onSubmit}>
              {submitting && <Loader2 className="animate-spin" />}
              {submitButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInputTab
