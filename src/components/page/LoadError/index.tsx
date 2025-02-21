import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { FileWarning, Folder } from 'lucide-react'
import { FC } from 'react'
import { cn } from '@/lib/utils'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { useLoadErrorPage } from './hook'
import ResetDialog from '../../model/ResetDialog'

type Props = {
  preferenceLoaded: boolean
  error: string
}

const LoadErrorPage: FC<Props> = ({ preferenceLoaded, error }) => {
  const { openAppDir, openAssetDir, openMetadataDir } = useLoadErrorPage()

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Card className="w-[600px] p-6">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-center">
            <FileWarning className="text-primary mr-2" size={30} />
            読み込みに失敗しました
          </CardTitle>
          <CardDescription className="flex justify-center">
            KonoAssetは正常にデータをロードできませんでした
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-card-foreground/60">エラーメッセージ: </p>
          <Separator />
          <div className="my-4">
            <ScrollArea>
              <div className="max-h-96">{error}</div>
            </ScrollArea>
          </div>
          <Separator />
          <div className="flex justify-center mt-6">
            続行するにはデータを修復するか、初期化する必要があります
          </div>
        </CardContent>
        <CardFooter className="mt-2 flex justify-between">
          <ResetDialog />
          <TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>データフォルダを開く</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={openAppDir}>
                  <Folder className="text-foreground/50" />
                  アプリデータ
                  <span className="text-foreground/60">(設定情報)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Tooltip>
                  <TooltipTrigger className="block cursor-default">
                    <DropdownMenuItem
                      disabled={!preferenceLoaded}
                      onClick={openAssetDir}
                    >
                      <Folder className="text-foreground/50" />
                      アセットデータ
                      <span className="text-foreground/60">(アセット本体)</span>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent className={cn(preferenceLoaded && 'hidden')}>
                    <p>設定ファイルが読み込めていないため、パスが不明です</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="block cursor-default">
                    <DropdownMenuItem
                      disabled={!preferenceLoaded}
                      onClick={openMetadataDir}
                    >
                      <Folder className="text-foreground/50" />
                      メタデータ
                      <span className="text-foreground/60">(アセット情報)</span>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent className={cn(preferenceLoaded && 'hidden')}>
                    <p>設定ファイルが読み込めていないため、パスが不明です</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </CardFooter>
      </Card>
      <div className="mt-4 flex flex-row text-foreground/50 space-x-2">
        <p>問題を報告する:</p>
        <a
          href="https://go.konoasset.dev/discord"
          rel="noopener noreferrer"
          target="_blank"
          className="underline"
        >
          Discord
        </a>
        <p>/</p>
        <a
          href="https://go.konoasset.dev/github"
          rel="noopener noreferrer"
          target="_blank"
          className="underline"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

export default LoadErrorPage
