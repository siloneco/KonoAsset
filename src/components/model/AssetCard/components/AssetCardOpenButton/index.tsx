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
import {
  Check,
  ChevronDown,
  Copy,
  Folder,
  FolderTree,
  Loader2,
} from 'lucide-react'
import { useAssetCardOpenButton } from './hook'
import { FileInfo } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  className?: string
  id: string
  hasDependencies: boolean

  openSelectUnitypackageDialog: () => void
  openDependencyDialog: () => void
  setUnitypackageFiles: (data: { [x: string]: FileInfo[] }) => void
}

const AssetCardOpenButton = ({
  className,
  id,
  hasDependencies,
  openSelectUnitypackageDialog,
  openDependencyDialog,
  setUnitypackageFiles,
}: Props) => {
  const {
    onMainButtonClick,
    mainButtonChecked,
    mainButtonLoading,
    onOpenManagedDirButtonClick,
    onCopyPathButtonClick,
    displayOpenButtonText,
  } = useAssetCardOpenButton({
    id,
    hasDependencies,
    openSelectUnitypackageDialog,
    setUnitypackageFiles,
  })

  const { t } = useLocalization()

  return (
    <div className={cn('flex flex-row ', className)}>
      <Button
        className={cn('w-full rounded-r-none px-0')}
        onClick={onMainButtonClick}
      >
        {!mainButtonLoading && !mainButtonChecked && <Folder size={24} />}
        {mainButtonLoading && !mainButtonChecked && (
          <Loader2
            size={24}
            className="text-primary-foreground/70 animate-spin"
          />
        )}
        {mainButtonChecked && <Check size={24} />}
        {displayOpenButtonText && <p>{t('general:button:open')}</p>}
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
            {t('assetcard:open-button:open-dir')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={openDependencyDialog}
            disabled={!hasDependencies}
          >
            <FolderTree className="text-foreground/50" />
            {t('general:prerequisite-assets')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onCopyPathButtonClick}>
            <Copy className="text-foreground/50" />
            {t('assetcard:open-button:copy-path')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default AssetCardOpenButton
