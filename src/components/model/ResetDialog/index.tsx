import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import CheckboxAndLabel from './components/CheckboxAndLabel'
import { useResetDialog } from './hook'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { FC } from 'react'

type Props = {
  className?: string
}

const ResetDialog: FC<Props> = ({ className }) => {
  const {
    deleteAppData,
    deleteMetadata,
    deleteAssetData,
    setDeleteAppData,
    setDeleteMetadata,
    setDeleteAssetData,
    executeReset,
    executing,
    confirm,
    setConfirm,
    submitButtonDisabled,
  } = useResetDialog()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={className}>
          初期化する
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に初期化しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せないため、慎重に行ってください。
            <br />
            削除を実行すると、アプリケーションは自動で再起動します。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label className="text-base">削除する項目</Label>
          <CheckboxAndLabel
            mainText="アプリデータ"
            subText="設定ファイル"
            checked={deleteAppData}
            setChecked={setDeleteAppData}
            disabled={executing}
          />
          <CheckboxAndLabel
            mainText="メタデータ"
            subText="アセット情報"
            checked={deleteMetadata}
            setChecked={setDeleteMetadata}
            disabled={executing}
          />
          <CheckboxAndLabel
            mainText="アセットデータ"
            subText="アセットデータ本体"
            checked={deleteAssetData}
            setChecked={setDeleteAssetData}
            disabled={executing}
          />
        </div>
        <Separator />
        <div className="mx-auto">
          <CheckboxAndLabel
            mainText="私は削除後のデータが元に戻せないことを理解しています"
            checked={confirm}
            setChecked={setConfirm}
            disabled={executing}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-auto" disabled={executing}>
            キャンセル
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={executeReset}
            disabled={submitButtonDisabled}
          >
            {executing && <Loader2 className="animate-spin" />}
            削除する
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ResetDialog
