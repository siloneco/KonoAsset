import SquareImage from '@/components/model/SquareImage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { AssetDisplay, DirectoryOpenResult } from '@/lib/entity'
import { Route } from '@/routes/edit.$id'
import { Link } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'
import { FC } from 'react'

type Props = {
  asset: AssetDisplay
}

const SlimAssetDetail: FC<Props> = ({ asset }) => {
  const openInFileManager = async () => {
    const result: DirectoryOpenResult = await invoke('open_in_file_manager', {
      id: asset.id,
    })

    if (!result.success) {
      toast({
        title: 'エラー',
        description: result.error_message,
      })
    }
  }

  return (
    <Card className="flex flex-row p-2 max-w-[600px] space-x-4">
      <div className="w-16 h-16">
        <SquareImage
          assetType={asset.asset_type}
          path={asset.image_src ?? undefined}
        />
      </div>
      <div>
        <p className="truncate text-ellipsis w-[360px]">{asset.title}</p>
        <p className="text-card-foreground/60 truncate text-ellipsis w-[360px]">
          {asset.author}
        </p>
      </div>
      <div className="space-x-2 flex flex-row items-center">
        <Button onClick={openInFileManager}>開く</Button>
        <Button variant={'secondary'}>
          <Link to={Route.to} params={{ id: asset.id }}>
            編集
          </Link>
        </Button>
      </div>
    </Card>
  )
}

export default SlimAssetDetail
