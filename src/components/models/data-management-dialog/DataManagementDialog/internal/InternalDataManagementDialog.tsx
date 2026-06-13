import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, File, Folder, InfoIcon, RefreshCcw } from 'lucide-react'
import { sep } from '@tauri-apps/api/path'
import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'
import { useInternalDataManagementDialog } from './hook'
import { SimplifiedDirEntry } from '@/lib/bindings'
import { OngoingImportEntry } from '@/stores/dialogs/DataManagementDialogStore/index.types'
import { DirEntryRow } from '../../DirEntryRow'
import { OngoingImportRow } from '../../OngoingImportRow'

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void

  // null のときは loading とみなす
  id: string | null
  entries: SimplifiedDirEntry[]
  ongoingImports: OngoingImportEntry[]

  refreshEntries: () => Promise<void>
  onAddButtonClick: (isDir: boolean) => Promise<void>
}

export const InternalDataManagementDialog: FC<Props> = ({
  isOpen,
  setOpen,
  id,
  entries,
  ongoingImports,
  refreshEntries,
  onAddButtonClick,
}) => {
  const { t } = useLocalization()
  const { refreshButtonChecked, onRefreshButtonClicked } =
    useInternalDataManagementDialog({ refreshEntries })

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t('assetcard:more-button:data-management')}
            <Button
              className="size-8 ml-2"
              variant="outline"
              onClick={onRefreshButtonClicked}
            >
              {!refreshButtonChecked && <RefreshCcw />}
              {refreshButtonChecked && <Check className="text-green-400" />}
            </Button>
          </DialogTitle>
          <DialogDescription>
            {t('assetcard:more-button:data-management:explanation-text-1')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-52 pr-4">
          <div className="grid grid-cols-1 gap-1">
            {id !== null &&
              entries.map((entry) => (
                <DirEntryRow
                  key={entry.absolutePath}
                  assetId={id}
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
                />
              )
            })}
          </div>
        </ScrollArea>
        <div className="flex gap-2 justify-center items-center">
          <p className="text-muted-foreground">
            {t('assetcard:more-button:data-management:add-file-or-folder')}
          </p>
          <Button variant="secondary" onClick={() => onAddButtonClick(false)}>
            <File />
          </Button>
          <Button variant="secondary" onClick={() => onAddButtonClick(true)}>
            <Folder />
          </Button>
        </div>
        <div className="flex gap-1 justify-center items-center">
          <InfoIcon className="size-6 text-primary" />
          <p className="text-muted-foreground">
            {t('assetcard:more-button:data-management:explanation-text-2')}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>{t('general:complete')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
