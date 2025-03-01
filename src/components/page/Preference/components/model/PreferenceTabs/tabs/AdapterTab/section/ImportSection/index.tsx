import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FolderInput, Info } from 'lucide-react'
import { useImportSection } from './hook'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export const ImportSection = () => {
  const { dialogOpen, startImport, progress, filename } = useImportSection()

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
      <Dialog open={dialogOpen}>
        <DialogContent
          className="max-w-[600px] [&>button]:hidden"
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>インポート中...</DialogTitle>
            <DialogDescription>
              データをインポートしています...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1 max-w-[550px]">
            <p className="text-muted-foreground w-full truncate">{filename}</p>
            <Progress value={progress} />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" className="mx-auto">
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
