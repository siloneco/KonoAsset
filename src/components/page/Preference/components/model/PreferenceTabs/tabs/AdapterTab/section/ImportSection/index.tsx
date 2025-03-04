import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FolderInput, Info } from 'lucide-react'
import { useImportSection } from './hook'
import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'

export const ImportSection = () => {
  const { taskId, startImport, onCompleted, onCancelled, onFailed } =
    useImportSection()

  return (
    <div>
      <Label className="text-xl flex flex-row items-center">
        インポート
        <FolderInput className="text-foreground/50 ml-2" />
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">
        KonoAsset互換のデータを選択して、既存のデータに追加します
      </p>
      <div className="w-full flex justify-center my-6">
        <Alert className="w-full mx-8 max-w-[800px] border-primary">
          <Info className="h-4 w-4" />
          <AlertTitle>注意</AlertTitle>
          <AlertDescription>
            インポートを実行する前に、データをバックアップすることをオススメします！
          </AlertDescription>
        </Alert>
      </div>
      <div className="w-full flex justify-center">
        <Button className="w-1/4" onClick={startImport}>
          フォルダを選んでインポート
        </Button>
      </div>
      <TaskStatusHandler
        taskId={taskId}
        title="インポート中..."
        description="データをインポートしています..."
        cancelButtonText="キャンセル"
        onCompleted={onCompleted}
        onCancelled={onCancelled}
        onFailed={onFailed}
      />
    </div>
  )
}
