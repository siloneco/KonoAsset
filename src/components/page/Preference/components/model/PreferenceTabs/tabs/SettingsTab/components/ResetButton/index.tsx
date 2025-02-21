import ResetDialog from '@/components/model/ResetDialog'
import { Label } from '@/components/ui/label'

const ResetButton = () => {
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 w-full">
        <Label className="text-lg">アプリケーションを初期化する</Label>
        <p className="text-foreground/60 text-sm w-10/12">
          アプリケーションに登録されているデータを選択して、それらを初期化します。
          <span className="font-bold">この操作は取り消せません！</span>
        </p>
      </div>
      <ResetDialog />
    </div>
  )
}

export default ResetButton
