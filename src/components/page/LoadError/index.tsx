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
import { ResetDialog } from '../../model/ResetDialog'
import { useLocalization } from '@/hooks/use-localization'
import { CubicLanguageSelector } from './components/CubicLanguageSelector'

type Props = {
  preferenceLoaded: boolean
  error: string
}

export const LoadErrorPage: FC<Props> = ({ preferenceLoaded, error }) => {
  const { openAppDir, openAssetDir, openMetadataDir, onLanguageChanged } =
    useLoadErrorPage()

  const { t } = useLocalization()

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center selection:bg-primary selection:text-primary-foreground">
      <Card className="w-[600px] p-6 relative">
        <div className="absolute top-5 right-5">
          <CubicLanguageSelector onSelected={onLanguageChanged} />
        </div>
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-center">
            <FileWarning className="text-primary mr-2" size={30} />
            {t('loaderror:load-error')}
          </CardTitle>
          <CardDescription className="flex justify-center">
            {t('loaderror:load-error:description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-muted-foreground">
            {t('loaderror:load-error:errormessage')}
          </p>
          <Separator />
          <div className="my-4">
            <ScrollArea>
              <div className="max-h-96">{error}</div>
            </ScrollArea>
          </div>
          <Separator />
          <div className="flex justify-center mt-6">
            {t('loaderror:load-error:explanation-text')}
          </div>
        </CardContent>
        <CardFooter className="mt-2 flex justify-between">
          <ResetDialog />
          <TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{t('loaderror:button:open-data-dir')}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={openAppDir}>
                  <Folder className="text-foreground/50" />
                  {t('general:appdata')}
                  <span className="text-muted-foreground">
                    ({t('general:appdata:subtext')})
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Tooltip>
                  <TooltipTrigger className="block cursor-default">
                    <DropdownMenuItem
                      disabled={!preferenceLoaded}
                      onClick={openMetadataDir}
                    >
                      <Folder className="text-foreground/50" />
                      {t('general:metadata')}
                      <span className="text-muted-foreground">
                        ({t('general:metadata:subtext')})
                      </span>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent className={cn(preferenceLoaded && 'hidden')}>
                    <p>{t('loaderror:appdata-not-found-text')}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="block cursor-default">
                    <DropdownMenuItem
                      disabled={!preferenceLoaded}
                      onClick={openAssetDir}
                    >
                      <Folder className="text-foreground/50" />
                      {t('general:assetdata')}
                      <span className="text-muted-foreground">
                        ({t('general:assetdata:subtext')})
                      </span>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent className={cn(preferenceLoaded && 'hidden')}>
                    <p>{t('loaderror:appdata-not-found-text')}</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </CardFooter>
      </Card>
      <div className="mt-4 flex flex-row text-muted-foreground space-x-2">
        <p>{t('loaderror:report-error')}</p>
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
