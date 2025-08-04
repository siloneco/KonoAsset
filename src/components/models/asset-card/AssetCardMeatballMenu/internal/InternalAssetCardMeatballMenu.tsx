import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLocalization } from '@/hooks/use-localization'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Folder,
  Trash2,
  Loader2,
} from 'lucide-react'
import { FC } from 'react'
import { useInternalAssetCardMeatballMenu } from './hook'

type Props = {
  className?: string
  boothUrl?: string
  openEditAssetDialog: () => void
  openDataManagementDialog: () => void
  executeAssetDeletion: () => Promise<void>
}

export const InternalAssetCardMeatballMenu: FC<Props> = ({
  className,
  boothUrl,
  openEditAssetDialog,
  openDataManagementDialog,
  executeAssetDeletion,
}) => {
  const { t } = useLocalization()

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteInProgress,
    onDeleteConfirmButtonClick,
  } = useInternalAssetCardMeatballMenu({ executeAssetDeletion })

  const hasBoothUrl = boothUrl !== undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={cn('size-10', className)}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <DropdownMenuItem asChild disabled={!hasBoothUrl}>
                <a href={boothUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="text-card-foreground/40" />
                  {t('assetcard:more-button:open-booth')}
                </a>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent className={cn(hasBoothUrl && 'hidden')}>
              <p>{t('assetcard:more-button:open-booth:error-text')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuItem onClick={() => openEditAssetDialog()}>
          <Pencil className="text-card-foreground/40" />
          {t('assetcard:more-button:edit-info')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDataManagementDialog()}>
          <Folder className="text-card-foreground/40" />
          {t('assetcard:more-button:data')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              className="font-semibold"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="text-card-foreground/40" />
              {t('general:button:delete')}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('assetcard:more-button:delete-confirm')}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <span className="inline-block">
                  {t('assetcard:more-button:delete-confirm:explanation-text-1')}
                </span>
                <br />
                <span className="inline-block font-bold">
                  {t('assetcard:more-button:delete-confirm:explanation-text-2')}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteInProgress}>
                {t('general:button:cancel')}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={deleteInProgress}
                onClick={onDeleteConfirmButtonClick}
              >
                {deleteInProgress && <Loader2 className="animate-spin" />}
                {t('general:button:delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
