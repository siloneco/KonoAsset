import { FC } from 'react'
import { useDestinationSelectTab } from './hook'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Info, Loader2 } from 'lucide-react'

type Props = {
  currentDataDir: string
  switchToProgressTab: (taskId: string) => void
  destinationPath: string
  setDestinationPath: (path: string) => void
  migrationEnabled: boolean
  setMigrationEnabled: (enabled: boolean) => void
}

const DestinationSelectTab: FC<Props> = ({
  currentDataDir,
  switchToProgressTab,
  destinationPath,
  setDestinationPath,
  migrationEnabled,
  setMigrationEnabled,
}) => {
  const {
    executeButtonDisabled,
    executing,
    onOpenButtonClick,
    onSelectDestinationPathClick,
    onExecuteButtonClick,
  } = useDestinationSelectTab({
    destinationPath,
    setDestinationPath,
    migrationEnabled,
    switchToProgressTab,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>アプリデータの保存先を変更する</DialogTitle>
        <DialogDescription>
          アセットや画像データを保存するディレクトリを変更する場合は以下の入力を行い移行してください
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="mt-4">
          <Label>元の保存先</Label>
          <div className="mt-1 flex flex-row items-center">
            <Input value={currentDataDir} disabled />
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
            <Input value={destinationPath} disabled />
            <Button
              variant="secondary"
              className="ml-2"
              onClick={onSelectDestinationPathClick}
            >
              選択
            </Button>
          </div>
        </div>
        <div className="w-full mt-8 flex flex-row items-center justify-center">
          <Checkbox
            checked={migrationEnabled}
            onCheckedChange={setMigrationEnabled}
          />
          <Label
            className="ml-2"
            onClick={() => setMigrationEnabled(!migrationEnabled)}
          >
            データ移行を自動で行う
          </Label>
        </div>
        {!migrationEnabled && (
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
          <Button variant="secondary" className="mr-auto" disabled={executing}>
            キャンセル
          </Button>
        </DialogClose>
        <Button
          disabled={executeButtonDisabled || executing}
          onClick={onExecuteButtonClick}
        >
          {executing && <Loader2 className="animate-spin" />}
          {migrationEnabled ? '移行' : '変更'}
        </Button>
      </DialogFooter>
    </>
  )
}

export default DestinationSelectTab
