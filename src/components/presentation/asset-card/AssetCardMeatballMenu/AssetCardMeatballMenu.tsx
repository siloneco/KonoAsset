import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import {
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Folder,
  Trash2,
} from 'lucide-react'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useLocalization } from '@/hooks/use-localization'
import { AssetCardDeleteDialog } from '../AssetCardDeleteDialog/AssetCardDeleteDialog'
import { useAssetCardMeatballMenu } from './hook'
import { BOOTH_TOP_PAGE_URL } from './AssetCardMeatballMenu.constants'
import { FC } from 'react'
import { LanguageCode } from '@/lib/bindings'

type Props = {
  language: LanguageCode
  boothItemId: number | null
  openDirEditDialog: () => Promise<void>
  openEditAssetDialog: () => Promise<void>
  deleteAsset: () => Promise<void>
}

export const AssetCardMeatballMenu: FC<Props> = ({
  language,
  boothItemId,
  openDirEditDialog,
  openEditAssetDialog,
  deleteAsset,
}) => {
  const { t } = useLocalization()

  const { boothUrl, deleteDialogOpen, setDeleteDialogOpen } =
    useAssetCardMeatballMenu({
      boothItemId,
      language,
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="my-auto size-10">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default w-full">
              <DropdownMenuItem asChild disabled={boothUrl === null}>
                <a
                  href={boothUrl ?? BOOTH_TOP_PAGE_URL}
                  className="decoration-inherit text-inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} className="text-card-foreground/40" />
                  {t('assetcard:more-button:open-booth')}
                </a>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent className={cn({ hidden: boothUrl !== null })}>
              <p>{t('assetcard:more-button:open-booth:error-text')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuItem onClick={openEditAssetDialog}>
          <Pencil size={16} className="text-card-foreground/40" />
          {t('assetcard:more-button:edit-info')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openDirEditDialog}>
          <Folder size={16} className="text-card-foreground/40" />
          {t('assetcard:more-button:data')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AssetCardDeleteDialog
          dialogOpen={deleteDialogOpen}
          setDialogOpen={setDeleteDialogOpen}
          deleteAsset={deleteAsset}
        >
          <DropdownMenuItem
            className="font-bold text-red-600 focus:text-red-600 dark:text-red-700 dark:focus:text-red-700"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 size={16} className="text-card-foreground/40" />
            {t('general:button:delete')}
          </DropdownMenuItem>
        </AssetCardDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
