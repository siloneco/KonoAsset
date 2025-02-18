import { Button } from '@/components/ui/button'
import { Check, File, Folder, FolderOpen, Loader2, Trash2 } from 'lucide-react'
import { FC } from 'react'
import useDirEntryRow from './hook'
import { cn } from '@/lib/utils'

type Props = {
  assetId: string
  type: 'directory' | 'file'
  filename: string
  absolutePath: string
}

const DirEntryRow: FC<Props> = ({ assetId, type, filename, absolutePath }) => {
  const {
    openInFileManager,
    deleteEntry,
    openButtonCheckMarked,
    isDeleting,
    isDeleted,
  } = useDirEntryRow({ assetId, absolutePath })

  return (
    <div className="flex flex-row items-center space-x-2">
      {type === 'directory' && (
        <Folder size={24} className="text-foreground/40" />
      )}
      {type === 'file' && <File size={24} className="text-foreground/40" />}
      <p className={cn('w-96 truncate', isDeleted && 'line-through')}>
        {filename}
        {type === 'directory' && <span>/</span>}
      </p>
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
      <Button
        variant="destructive"
        className="h-8 w-8"
        onClick={deleteEntry}
        disabled={isDeleting || isDeleted}
      >
        {isDeleting && <Loader2 className="animate-spin" />}
        {!isDeleting && !isDeleted && <Trash2 />}
        {!isDeleting && isDeleted && <Check />}
      </Button>
    </div>
  )
}

export default DirEntryRow
