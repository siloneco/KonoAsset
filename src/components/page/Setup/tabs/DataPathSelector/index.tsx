import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { FC } from 'react'

type Props = {
  path: string
  setPath: (path: string) => Promise<void>
}

export const DataPathSelector: FC<Props> = ({ path, setPath }) => {
  const { t } = useLocalization()

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
    <div className="w-full h-80 flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold">{t('setup:tab:2:title')}</h2>
      <p className="mt-4 text-muted-foreground">
        {t('setup:tab:2:description-1')}
      </p>
      <p className="text-muted-foreground">{t('setup:tab:2:description-2')}</p>
      <div className="flex flex-row space-x-2 items-end w-full mt-8 px-12">
        <div className="w-full">
          <Label>{t('setup:tab:2:input-label')}</Label>
          <Input value={path} disabled className="mt-1 w-full" />
        </div>
        <Button variant="secondary" onClick={openDirectory}>
          {t('general:button:open')}
        </Button>
        <Button onClick={selectPath}>{t('general:select:placeholder')}</Button>
      </div>
    </div>
  )
}
