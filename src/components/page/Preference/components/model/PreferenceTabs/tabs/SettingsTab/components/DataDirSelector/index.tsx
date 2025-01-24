import { Label } from '@/components/ui/label'
import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDataDirSelector } from './hook'
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Info, Loader2 } from 'lucide-react'
import { Result } from '@/lib/bindings'

type Props = {
  dataDir: string
  setDataDir: (dataDir: string, save: boolean) => Promise<Result<null, string>>
}

const DataDirSelector: FC<Props> = ({ dataDir, setDataDir }) => {
  const {
    dialogOpen,
    migrateDestinationPath,
    migrateData,
    setMigrateData,
    executeButtonDisabled,
    executing,
    onDialogOpenChange,
    onOpenButtonClick,
    onSelectMigrateDestinationPathClick,
    onExecuteButtonClick,
  } = useDataDirSelector({ setDataDir })

  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 grow">
        <Label className="text-xl">アプリデータの保存先</Label>
        <p className="text-foreground/60 text-sm">
          アセットや画像を保存するディレクトリを設定します
        </p>
        <div className="flex flex-row w-4/5">
          <Input value={dataDir} className="w-full max-w-[7y00px]" disabled />
          <Button
            variant="outline"
            className="ml-2"
            onClick={onOpenButtonClick}
          >
            開く
          </Button>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
        <DialogTrigger asChild>
          <Button className="ml-2" variant="secondary">
            変更する
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>アプリデータの保存先を変更する</DialogTitle>
            <DialogDescription>
              アセットや画像データを保存するディレクトリを変更する場合は以下の入力を行い移行してください
            </DialogDescription>
          </DialogHeader>
          <div>
            <div>
              <Label>元の保存先</Label>
              <div className="mt-1 flex flex-row items-center">
                <Input value={dataDir} disabled />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={onOpenButtonClick}
                >
                  開く
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Label>新しい保存先</Label>
              <div className="mt-1 flex flex-row items-center">
                <Input value={migrateDestinationPath} disabled />
                <Button
                  variant="secondary"
                  className="ml-2"
                  onClick={onSelectMigrateDestinationPathClick}
                >
                  選択
                </Button>
              </div>
            </div>
            <div className="w-full mt-8 flex flex-row items-center justify-center">
              <Checkbox
                checked={migrateData}
                onCheckedChange={setMigrateData}
              />
              <Label
                className="ml-2"
                onClick={() => setMigrateData(!migrateData)}
              >
                データ移行を自動で行う
              </Label>
            </div>
            {!migrateData && (
              <div className="flex flex-row items-center justify-center mt-2 text-sm text-foreground/60">
                <Info size={20} className="text-primary" />
                <div className="ml-1">
                  <p>手動でのデータ移行はデータ破損の危険があるため</p>
                  <p>十分に理解している場合のみ行ってください</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="mr-auto"
                disabled={executing}
              >
                キャンセル
              </Button>
            </DialogClose>
            <Button
              disabled={executeButtonDisabled || executing}
              onClick={onExecuteButtonClick}
            >
              {executing && <Loader2 className="animate-spin" />}
              {migrateData ? '移行' : '変更'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataDirSelector
