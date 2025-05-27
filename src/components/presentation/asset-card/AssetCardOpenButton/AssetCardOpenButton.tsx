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
import { FC } from 'react'

type Props = {
  className?: string
  mainButtonClassName?: string
  sideButtonClassName?: string
  hideOpenButtonText?: boolean
  onDependencyDialogButtonClick: (() => Promise<void>) | null
  onOpenButtonClick: () => Promise<boolean>
  onOpenManagedDirButtonClick: () => Promise<void>
  onCopyPathButtonClick: () => Promise<void>
}

export const AssetCardOpenButton: FC<Props> = ({
  className,
  mainButtonClassName,
  sideButtonClassName,
  hideOpenButtonText = false,
  onDependencyDialogButtonClick,
  onOpenButtonClick,
  onOpenManagedDirButtonClick,
  onCopyPathButtonClick,
}) => {
  const { openButtonLoading, openButtonChecked, onMainOpenButtonClick } =
    useAssetCardOpenButton({
      onOpenButtonClick,
    })
  const { t } = useLocalization()

  const loadingOrChecked = openButtonLoading || openButtonChecked

  return (
    <div className={cn('flex flex-row w-full', className)}>
      <Button
        className={cn(
          'h-10 flex-grow rounded-r-none',
          hideOpenButtonText && 'px-0',
          mainButtonClassName,
        )}
        onClick={onMainOpenButtonClick}
      >
        {!loadingOrChecked && <Folder size={24} />}
        {openButtonLoading && !openButtonChecked && (
          <Loader2
            size={24}
            className="text-primary-foreground/70 animate-spin"
          />
        )}
        {openButtonChecked && <Check size={24} />}
        {!hideOpenButtonText && (
          <p className="select-none">{t('general:button:open')}</p>
        )}
      </Button>
      <Separator orientation="vertical" className="bg-card" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              'h-10 w-2 p-3 m-0 rounded-l-none',
              sideButtonClassName,
            )}
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onOpenManagedDirButtonClick}>
            <Folder className="text-foreground/50" />
            {t('assetcard:open-button:open-dir')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDependencyDialogButtonClick ?? (() => {})}
            disabled={onDependencyDialogButtonClick === null}
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
