import SquareImage from '@/components/model/SquareImage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { AssetSummary, commands } from '@/lib/bindings'
import { Route } from '@/routes/edit.$id'
import { Link } from '@tanstack/react-router'
import { FC } from 'react'

type Props = {
  asset: AssetSummary
}

const SlimAssetDetail: FC<Props> = ({ asset }) => {
  const openInFileManager = async () => {
    const result = await commands.openManagedDir(asset.id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
    }
  }

  return (
    <Card className="flex flex-row p-2 max-w-[600px] space-x-4">
      <div className="w-16 h-16">
        <SquareImage
          assetType={asset.assetType}
          filename={asset.imageFilename ?? undefined}
        />
      </div>
      <div>
        <p className="truncate text-ellipsis w-[360px]">{asset.name}</p>
        <p className="text-card-foreground/60 truncate text-ellipsis w-[360px]">
          {asset.creator}
        </p>
      </div>
      <div className="space-x-2 flex flex-row items-center">
        <Button onClick={openInFileManager}>開く</Button>
        <Button variant={'secondary'}>
          <Link to={Route.to} params={{ id: asset.id }}>
            情報を編集
          </Link>
        </Button>
      </div>
    </Card>
  )
}

export default SlimAssetDetail
