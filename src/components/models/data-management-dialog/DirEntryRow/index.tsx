import { Button } from '@/components/ui/button'
import { Check, File, Folder, FolderOpen, Loader2, Trash2 } from 'lucide-react'
import { FC } from 'react'
import { useDirEntryRow } from './hook'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useLocalization } from '@/hooks/use-localization'
import { PopoverClose } from '@radix-ui/react-popover'

type Props = {
  assetId: string
  type: 'directory' | 'file'
  filename: string
  absolutePath: string
}

export const DirEntryRow: FC<Props> = ({
  assetId,
  type,
  filename,
  absolutePath,
}) => {
  const { t } = useLocalization()

  const {
    displayName,
    openInFileManager,
    deleteEntry,
    openButtonChecked,
    deletePhase,
  } = useDirEntryRow({ assetId, absolutePath, filename, type })

  const Icon = type === 'directory' ? Folder : File

  return (
    <div className="flex flex-row items-center space-x-2">
      <Icon size={24} className="text-muted-foreground/80 shrink-0" />
      <div className="w-full shrink min-w-0">
        <p
          title={displayName}
          className={cn(
            'truncate',
            deletePhase === 'deleted' && 'line-through',
          )}
        >
          {displayName}
        </p>
      </div>
      {deletePhase !== 'deleted' && (
        <Button
          variant="secondary"
          className={cn('size-8', openButtonChecked && 'text-green-400')}
          onClick={openInFileManager}
          disabled={deletePhase !== 'initial'}
        >
          {!openButtonChecked && <FolderOpen />}
          {openButtonChecked && <Check />}
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="destructive"
            className="size-8"
            disabled={deletePhase !== 'initial'}
          >
            {deletePhase === 'initial' && <Trash2 />}
            {deletePhase === 'deleting' && <Loader2 className="animate-spin" />}
            {deletePhase === 'deleted' && <Check />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit max-w-58 space-y-2" side="right">
          <p>{t('assetcard:more-button:data-management:delete-description')}</p>
          <PopoverClose asChild>
            <Button
              variant="destructive"
              className="w-full"
              onClick={deleteEntry}
            >
              {t('general:button:delete')}
            </Button>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  )
}
