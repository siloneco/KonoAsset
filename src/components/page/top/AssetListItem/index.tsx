import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { AvatarAsset, DirectoryOpenResult } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { Edit, Folder } from 'lucide-react'

type Props = {
  asset: AvatarAsset
  onDelete: () => void
}

const AssetListItem = ({ asset }: Props) => {
  const { toast } = useToast()
  function openEditPage() {
    document.location.href = `/edit/${asset.id}`
  }

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
    <Card className="w-full bg-card m-1">
      <CardContent className="p-4">
        <img
          src={asset.description.image_src}
          alt={asset.description.title}
          className="w-full rounded-sm"
        />
        <CardTitle className="text-lg mt-2">
          {asset.description.title}
        </CardTitle>
        <Label className="text-sm">{asset.description.author}</Label>
        <div className="flex flex-row mt-2">
          <Button className="w-full mr-2" onClick={openInFileManager}>
            <Folder size={24} />
            <p>開く</p>
          </Button>
          <Button onClick={() => openEditPage()}>
            <Edit size={24} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetListItem
