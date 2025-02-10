import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Copy, Folder } from 'lucide-react'
import { useAssetCardOpenButton } from './hook'
import { FileInfo } from '@/lib/bindings'

type Props = {
  className?: string
  id: string

  openSelectUnitypackageDialog: () => void
  setUnitypackageFiles: (data: { [x: string]: FileInfo[] }) => void
}

const AssetCardOpenButton = ({
  className,
  id,
  openSelectUnitypackageDialog,
  setUnitypackageFiles,
}: Props) => {
  const {
    onMainButtonClick,
    onOpenManagedDirButtonClick,
    onCopyPathButtonClick,
  } = useAssetCardOpenButton({
    id,
    openSelectUnitypackageDialog,
    setUnitypackageFiles,
  })

  return (
    <div className={cn('flex flex-row ', className)}>
      <Button
        className={cn('w-full rounded-r-none')}
        onClick={onMainButtonClick}
      >
        <Folder size={24} />
        <p>開く</p>
      </Button>
      <Separator orientation="vertical" className="bg-card" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-l-none w-2 p-3 m-0">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onOpenManagedDirButtonClick}>
            <Folder className="text-foreground/50" />
            管理フォルダを開く
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onCopyPathButtonClick}>
            <Copy className="text-foreground/50" />
            パスをコピー
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default AssetCardOpenButton
