import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { FC } from 'react'

type Props = {
  path: string
  setPath: (path: string) => Promise<void>
}

export const DataPathSelector: FC<Props> = ({ path, setPath }) => {
  const { toast } = useToast()

  const openDirectory = async () => {
    const result = await commands.openFileInFileManager(path)

    if (result.status === 'ok') {
      return
    }

    toast({
      title: 'エラー: ディレクトリを開けませんでした',
      description: result.error,
    })
  }

  const selectPath = async () => {
    const path = await open({
      directory: true,
      multiple: false,
      canCreateDirectories: true,
      defaultPath: 'file:\\\\PC',
    })

    if (path === null) {
      return
    }

    await setPath(path)
  }

  return (
    <div className="w-full h-64 flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold">データの保存場所の選択</h2>
      <p className="mt-4 text-card-foreground/70">
        アセットのデータを保存するディレクトリを選択します
      </p>
      <p className="text-card-foreground/70">
        このディレクトリは後から設定で変更できます
      </p>
      <div className="flex flex-row space-x-2 items-end w-full mt-8 px-8">
        <div className="w-full">
          <Label>現在の保存場所</Label>
          <Input value={path} disabled className="mt-1 w-full" />
        </div>
        <Button variant="secondary" onClick={openDirectory}>
          開く
        </Button>
        <Button onClick={selectPath}>選択する</Button>
      </div>
    </div>
  )
}
