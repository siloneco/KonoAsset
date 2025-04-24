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
import { useLocalization } from '@/hooks/use-localization'
import { FileInfo } from '@/lib/bindings'

type Props = {
  className?: string
  id: string
  hasDependencies: boolean
  displayOpenButtonText: boolean
  openDependencyDialog: () => void
  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
}

const AssetCardOpenButton = ({
  className,
  id,
  hasDependencies,
  displayOpenButtonText,
  openDependencyDialog,
  openSelectUnitypackageDialog,
}: Props) => {
  const {
    onMainButtonClick,
    mainButtonChecked,
    mainButtonLoading,
    onOpenManagedDirButtonClick,
    onCopyPathButtonClick,
  } = useAssetCardOpenButton({
    id,
    hasDependencies,
    openSelectUnitypackageDialog,
  })

  const { t } = useLocalization()

  return (
    <div className={cn('flex flex-row w-full', className)}>
      <Button
        className={cn(
          'h-10 flex-grow rounded-r-none',
          !displayOpenButtonText && 'px-0',
        )}
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
          <Button className="rounded-l-none h-10 w-2 p-3 m-0">
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
