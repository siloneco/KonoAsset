import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useDataManagementDialog from './hook'
import DirEntryRow from './components/DirEntryRow'
import { Check, File, Folder, InfoIcon, RefreshCcw } from 'lucide-react'
import OngoingImportRow from './components/OngoingImportRow'
import { sep } from '@tauri-apps/api/path'

type Props = {
  assetId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DataManagementDialog = ({ assetId, open, onOpenChange }: Props) => {
  const {
    entries,
    onAddButtonClicked,
    refreshEntries,
    refreshButtonCheckMarked,
    ongoingImports,
    markOngoingImportAsFinished,
  } = useDataManagementDialog({ assetId, dialogOpen: open })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            アセットのデータ管理
            <Button
              className="ml-2 h-8 w-8"
              variant="outline"
              onClick={refreshEntries}
            >
              {!refreshButtonCheckMarked && <RefreshCcw />}
              {refreshButtonCheckMarked && <Check className="text-green-400" />}
            </Button>
          </DialogTitle>
          <DialogDescription>
            データの追加や削除が行えます。高度な操作はエクスプローラーから行ってください。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-52 pr-4">
          <div className="space-y-2 max-w-[446px]">
            {assetId !== null &&
              entries.map((entry) => (
                <DirEntryRow
                  key={entry.absolutePath}
                  assetId={assetId}
                  type={entry.entryType}
                  filename={entry.name}
                  absolutePath={entry.absolutePath}
                />
              ))}
            {ongoingImports.map((entry) => {
              const filename = entry.path.split(sep()).pop()!

              return (
                <OngoingImportRow
                  key={entry.taskId}
                  taskId={entry.taskId}
                  filename={filename}
                  markAsFinished={() =>
                    markOngoingImportAsFinished(entry.taskId)
                  }
                />
              )
            })}
          </div>
        </ScrollArea>
        <div className="flex flex-row justify-center items-center space-x-2">
          <p className="text-foreground/80">ファイルかフォルダを追加する: </p>
          <Button
            variant="secondary"
            onClick={async () => await onAddButtonClicked(false)}
          >
            <File />
          </Button>
          <Button
            variant="secondary"
            onClick={async () => await onAddButtonClicked(true)}
          >
            <Folder />
          </Button>
        </div>
        <div className="flex flex-row justify-center items-center space-x-2">
          <InfoIcon className="w-6 h-6 text-primary" />
          <p className="text-card-foreground/60">
            ウィンドウにファイルやフォルダをドロップしても新規追加できます
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>完了</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DataManagementDialog
