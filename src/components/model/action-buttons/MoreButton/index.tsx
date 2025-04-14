import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  MoreHorizontal,
  ExternalLink,
  Loader2,
  Pencil,
  Folder,
  Trash2,
} from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useLocalization } from '@/hooks/use-localization'
import { commands } from '@/lib/bindings'
import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'

type Props = {
  id: string
  boothItemID?: number
  openDataManagementDialog: () => void
  openEditAssetDialog: () => void
}

export const MoreButton = ({
  id,
  boothItemID,
  openDataManagementDialog,
  openEditAssetDialog,
}: Props) => {
  const [deleting, setDeleting] = useState(false)
  const [dialogOpened, setDialogOpened] = useState(false)
  const [boothUrl, setBoothUrl] = useState<string | undefined>(undefined)

  const { toast } = useToast()
  const { deleteAssetById } = useContext(AssetContext)

  const deleteAsset = async () => {
    const result = await commands.requestAssetDeletion(id)

    if (result.status === 'ok') {
      deleteAssetById(id)

      toast({
        title: t('assetcard:more-button:success-delete-toast'),
      })
    } else {
      toast({
        title: t('assetcard:more-button:fail-delete-toast'),
        description: result.error,
      })
    }
  }

  const onClick = async () => {
    setDeleting(true)
    try {
      await deleteAsset()
    } finally {
      setDeleting(false)
    }

    setDialogOpened(false)
  }
  const { t } = useLocalization()

  const updateBoothUrl = async (id: number) => {
    const result = await commands.getBoothUrl(id)
    if (result.status === 'ok') {
      setBoothUrl(result.data)
    } else {
      setBoothUrl(undefined)
    }
  }

  useEffect(() => {
    if (boothItemID === undefined) {
      setBoothUrl(undefined)
      return
    }

    updateBoothUrl(boothItemID)
  }, [boothItemID])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="my-auto w-10 h-10">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default w-full">
              <DropdownMenuItem asChild disabled={boothUrl === undefined}>
                <a
                  href={boothUrl}
                  className="decoration-inherit text-inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} className="text-card-foreground/40" />
                  {t('assetcard:more-button:open-booth')}
                </a>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent className={cn(boothUrl !== undefined && 'hidden')}>
              <p>{t('assetcard:more-button:open-booth:error-text')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuItem onClick={openEditAssetDialog}>
          <Pencil size={16} className="text-card-foreground/40" />
          {t('assetcard:more-button:edit-info')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openDataManagementDialog}>
          <Folder size={16} className="text-card-foreground/40" />
          {t('assetcard:more-button:data')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="font-bold text-destructive focus:text-destructive dark:text-red-500 dark:focus:text-red-500"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 size={16} className="text-card-foreground/40" />
              {t('general:button:delete')}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('assetcard:more-button:delete-confirm')}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  {t('assetcard:more-button:delete-confirm:explanation-text-1')}
                </p>
                <p className="font-bold">
                  {t('assetcard:more-button:delete-confirm:explanation-text-2')}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>
                {t('general:button:cancel')}
              </AlertDialogCancel>
              <Button
                variant={'destructive'}
                disabled={deleting}
                onClick={onClick}
              >
                {deleting && <Loader2 className="animate-spin" />}
                {t('general:button:delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
