import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { XCircle } from 'lucide-react'
import { FC } from 'react'
import { AssetCardListStyle } from '@/components/presentation/asset-card/AssetCardListStyle'
import { AssetSummary, Result } from '@/lib/bindings'
import { AssetSelectorInput } from '../AssetSelectorInput'

type Props = {
  dependencies: string[]
  setDependencies: (deps: string[]) => void
  assetSummaries: AssetSummary[]
  searchAssetsByText: (text: string) => Promise<Result<string[], string>>
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

export const DependencyInput: FC<Props> = ({
  dependencies,
  setDependencies,
  assetSummaries,
  searchAssetsByText,
  resolveImageAbsolutePath,
}) => {
  const { t } = useLocalization()

  return (
    <div className="w-full flex flex-row mb-4">
      <div className="w-full space-y-2">
        <Label>{t('general:prerequisite-assets')}</Label>
        <AssetSelectorInput
          assetSummaries={assetSummaries}
          hiddenAssetIds={dependencies}
          onSelected={(id) => {
            setDependencies([...dependencies, id])
          }}
          filterAssetByText={searchAssetsByText}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
        />
        <div className="w-full h-40 border-2 border-accent rounded-lg flex flex-col items-center justify-center dark:bg-input/30">
          {dependencies.length === 0 && (
            <p className="text-muted-foreground">
              {t('addasset:prerequisite-assets:empty')}
            </p>
          )}
          {dependencies.length > 0 && (
            <ScrollArea className="w-full h-full pr-2">
              <div className="grid grid-cols-1">
                {assetSummaries.map((asset) => {
                  if (!dependencies.includes(asset.id)) {
                    return null
                  }

                  return (
                    <AssetCardListStyle
                      key={asset.id}
                      asset={asset}
                      resolveImageAbsolutePath={resolveImageAbsolutePath}
                      className="w-full bg-background border-0 border-b"
                    >
                      <Button
                        className="size-10"
                        variant="destructive"
                        onClick={() => {
                          setDependencies(
                            dependencies.filter((dep) => dep !== asset.id),
                          )
                        }}
                      >
                        <XCircle />
                      </Button>
                    </AssetCardListStyle>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {t('addasset:prerequisite-assets:explanation-text')}
        </p>
      </div>
    </div>
  )
}
