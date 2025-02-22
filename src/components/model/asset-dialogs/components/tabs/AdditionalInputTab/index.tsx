import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Loader2 } from 'lucide-react'
import { useAdditionalInputTab } from './hook'
import { AssetFormType } from '@/lib/form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  form: AssetFormType
  onBackToPreviousTabClicked: () => void
  onSubmit: () => Promise<void>
  submitting: boolean

  tabIndex: number
  totalTabs: number

  hideDeleteSourceCheckbox?: boolean
  submitButtonText?: string
}

const AdditionalInputTab = ({
  form,
  onBackToPreviousTabClicked,
  onSubmit,
  submitting,

  tabIndex,
  totalTabs,

  hideDeleteSourceCheckbox = false,
  submitButtonText = 'アセットを追加',
}: Props) => {
  const { memo, setMemo, deleteSourceChecked, setDeleteSourceChecked } =
    useAdditionalInputTab({ form })

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) アセット情報の入力
        </DialogTitle>
        <DialogDescription>
          アセットの情報を入力してください！
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <div className="w-full flex flex-row space-x-2 mb-4">
          <div className="w-full space-y-2">
            <Label>メモ</Label>
            <Textarea
              value={memo ?? ''}
              onChange={(e) => setMemo(e.target.value)}
              autoComplete="off"
              className="resize-none h-36"
              placeholder="アセットに追加するメモを入力..."
            />
            <p className="text-card-foreground/60 text-sm">
              メモは情報整理や検索に利用できます
            </p>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <Button
            variant="outline"
            onClick={onBackToPreviousTabClicked}
            disabled={submitting}
          >
            戻る
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
                  インポート後に元ファイルを削除する
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
