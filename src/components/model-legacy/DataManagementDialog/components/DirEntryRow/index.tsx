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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
    openInFileManager,
    deleteEntry,
    openButtonCheckMarked,
    isDeleting,
    isDeleted,
  } = useDirEntryRow({ assetId, absolutePath })

  const displayName = `${filename}${type === 'directory' ? '/' : ''}`

  return (
    <div className="flex flex-row items-center space-x-2">
      {type === 'directory' && (
        <Folder size={24} className="text-foreground/40 shrink-0" />
      )}
      {type === 'file' && (
        <File size={24} className="text-foreground/40 shrink-0" />
      )}
      <div className="w-full shrink min-w-0">
        <Tooltip>
          <TooltipTrigger asChild tabIndex={0}>
            <p
              className={cn(
                'w-fit max-w-full truncate',
                isDeleted && 'line-through',
              )}
            >
              {displayName}
            </p>
          </TooltipTrigger>
          <TooltipContent>{displayName}</TooltipContent>
        </Tooltip>
      </div>
      {!isDeleted && (
        <Button
          variant="secondary"
          className={cn('h-8 w-8', openButtonCheckMarked && 'text-green-400')}
          onClick={openInFileManager}
          disabled={isDeleting || isDeleted}
        >
          {!openButtonCheckMarked && <FolderOpen />}
          {openButtonCheckMarked && <Check />}
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="destructive"
            className="size-8"
            disabled={isDeleting || isDeleted}
          >
            {isDeleting && <Loader2 className="animate-spin" />}
            {!isDeleting && !isDeleted && <Trash2 />}
            {!isDeleting && isDeleted && <Check />}
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
