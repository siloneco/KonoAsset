import SquareImage from '@/components/model/SquareImage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { AssetSummary, commands } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  className?: string
  asset: AssetSummary
  hideOpenButton?: boolean
  openEditDialog?: (assetId: string) => void
  actionComponent?: ReactNode
}

const SlimAssetDetail: FC<Props> = ({
  className,
  asset,
  hideOpenButton = false,
  openEditDialog,
  actionComponent,
}) => {
  const { t } = useLocalization()
  const openInFileManager = async () => {
    const result = await commands.openManagedDir(asset.id)

    if (result.status === 'error') {
      toast({
        title: t('general:error'),
        description: result.error,
      })
    }
  }

  return (
    <Card className={cn('flex flex-row p-2 space-x-4', className)}>
      <div className="w-12 h-12">
        <SquareImage
          assetType={asset.assetType}
          filename={asset.imageFilename ?? undefined}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-ellipsis w-full">{asset.name}</p>
        <p className="text-muted-foreground truncate text-ellipsis w-full">
          {asset.creator}
        </p>
      </div>
      <div className="space-x-2 flex flex-row items-center">
        {!hideOpenButton && (
          <Button onClick={openInFileManager}>
            {t('general:button:open')}
          </Button>
        )}
        {openEditDialog && (
          <Button
            variant={'secondary'}
            onClick={() => openEditDialog(asset.id)}
          >
            {t('slimassetdetail:edit-info')}
          </Button>
        )}
        {actionComponent}
      </div>
    </Card>
  )
}

export default SlimAssetDetail
