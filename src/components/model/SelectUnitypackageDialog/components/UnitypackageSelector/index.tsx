import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { commands, FileInfo } from '@/lib/bindings'
import { SiUnity } from '@icons-pack/react-simple-icons'
import { Folder } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  path: string
  files: FileInfo[]
  closeDialog: () => void
}

const UnitypackageSelector = ({ path, files, closeDialog }: Props) => {
  const open = async (filepath: string) => {
    const result = await commands.openFileInFileManager(filepath)
    if (result.status === 'error') {
      console.error(result.error)
    } else {
      closeDialog()
    }
  }

  const { t } = useLocalization()
  const displayPath = path.length > 0 ? path : './'

  return (
    <div className="w-full">
      <div className="flex flex-row items-center mb-1 text-muted-foreground">
        <Folder className="mr-2 shrink-0" size={18} />
        <span className="text-foreground truncate">{displayPath}</span>
      </div>
      <Card className="p-2 pl-4 w-full gap-2">
        {files.map((file) => (
          <div className="flex flex-row items-center w-full">
            <div className="flex shrink-0">
              <SiUnity size={18} />
            </div>
            <div className="flex shrink overflow-hidden mr-4">
              <p className="ml-2 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                {file.fileName}
              </p>
            </div>
            <Button
              className="ml-auto h-8 w-14"
              onClick={() => open(file.absolutePath)}
            >
              {t('general:button:open')}
            </Button>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default UnitypackageSelector
