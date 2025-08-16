import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileInfo } from '@/lib/bindings'
import { SiUnity } from '@icons-pack/react-simple-icons'
import { Folder } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'

type Props = {
  path: string
  files: FileInfo[]
  openFileInFileManager: (filepath: string) => void
}

export const DirectoryBlock: FC<Props> = ({
  path,
  files,
  openFileInFileManager,
}) => {
  const { t } = useLocalization()
  const displayPath = path.length > 0 ? path : './'

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center space-x-2">
        <Folder className="text-muted-foreground shrink-0" size={18} />
        <span className="text-foreground truncate">{displayPath}</span>
      </div>
      <Card className="w-full p-2 pl-4 gap-2">
        {files.map((file) => (
          <div
            key={file.absolutePath}
            className="flex items-center w-full space-x-2"
          >
            <SiUnity className="shrink-0" size={18} />
            <p className="truncate">{file.fileName}</p>
            <Button
              className="h-8 ml-auto"
              onClick={() => openFileInFileManager(file.absolutePath)}
            >
              {t('general:button:open')}
            </Button>
          </div>
        ))}
      </Card>
    </div>
  )
}
