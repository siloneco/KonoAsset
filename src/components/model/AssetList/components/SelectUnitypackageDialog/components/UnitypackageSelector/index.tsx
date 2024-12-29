import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { commands, FileInfo } from '@/lib/bindings'
import { SiUnity } from '@icons-pack/react-simple-icons'
import { Folder } from 'lucide-react'

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

  const displayPath = path.length > 0 ? path : './'

  return (
    <div>
      <div className="flex flex-row items-center mb-1 text-foreground/60">
        <Folder className="mr-2" size={18} />
        {displayPath}
      </div>
      <Card className="p-2 pl-4 space-y-2">
        {files.map((file) => (
          <div className="flex flex-row items-center">
            <SiUnity size={18} />
            <p className="ml-2">{file.fileName}</p>
            <Button
              className="ml-auto h-8"
              onClick={() => open(file.absolutePath)}
            >
              開く
            </Button>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default UnitypackageSelector
