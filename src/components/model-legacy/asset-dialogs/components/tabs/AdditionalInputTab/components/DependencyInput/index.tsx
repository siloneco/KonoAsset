import { AssetSelector } from '@/components/model-legacy/AssetSelector'
import { SlimAssetDetail } from '@/components/model-legacy/SlimAssetDetail'
import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { XCircle } from 'lucide-react'
import { FC } from 'react'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

type Props = {
  dependencies: string[]
  setDependencies: (deps: string[]) => void
}

export const DependencyInput: FC<Props> = ({
  dependencies,
  setDependencies,
}) => {
  const { t } = useLocalization()
  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
  )

  return (
    <div className="w-full flex flex-row mb-4">
      <div className="w-full space-y-2">
        <Label>{t('general:prerequisite-assets')}</Label>
        <AssetSelector
          assets={sortedAssetSummaries}
          slimAssetDetailClassName="max-w-[570px]"
          ignoredAssetIds={dependencies}
          onSelected={(id) => {
            setDependencies([...dependencies, id])
          }}
        />
        <div className="w-full h-40 border-2 border-accent rounded-lg flex flex-col items-center justify-center">
          {dependencies.length <= 0 && (
            <p className="text-muted-foreground">
              {t('addasset:prerequisite-assets:empty')}
            </p>
          )}
          {dependencies.length > 0 && (
            <ScrollArea className="w-full h-full pr-2">
              {sortedAssetSummaries.map((asset) => {
                if (!dependencies.includes(asset.id)) {
                  return null
                }

                return (
                  <SlimAssetDetail
                    key={asset.id}
                    asset={asset}
                    className="w-full max-w-[588px] bg-background border-0 border-b"
                  >
                    <Button
                      className="w-10 h-10"
                      variant="destructive"
                      onClick={() => {
                        setDependencies(
                          dependencies.filter((dep) => dep !== asset.id),
                        )
                      }}
                    >
                      <XCircle />
                    </Button>
                  </SlimAssetDetail>
                )
              })}
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
