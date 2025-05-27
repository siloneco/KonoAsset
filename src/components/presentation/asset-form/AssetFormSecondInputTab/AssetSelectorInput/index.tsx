import { Input } from '@/components/ui/input'
import { AssetSummary, Result } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { PlusCircle, Search } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAssetSelectorInput } from './hook'
import { useLocalization } from '@/hooks/use-localization'
import { AssetCardListStyle } from '@/components/presentation/asset-card/AssetCardListStyle'

type Props = {
  assetSummaries: AssetSummary[]
  hiddenAssetIds: string[]
  onSelected: (assetId: string) => void
  filterAssetByText: (text: string) => Promise<Result<string[], string>>
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

export const AssetSelectorInput: FC<Props> = ({
  assetSummaries,
  hiddenAssetIds,
  onSelected,
  filterAssetByText,
  resolveImageAbsolutePath,
}) => {
  const { t } = useLocalization()
  const {
    open,
    onFocus,
    onBlur,
    searchInput,
    onSearchInputChange,
    inputRef,
    popoverMaxHeight,
    isMatchedToSearch,
    addAndClose,
  } = useAssetSelectorInput({ onSelected, filterAssetByText })

  return (
    // tabIndex 0 がないと、ポップアップをクリックしたときに閉じてしまう
    <div tabIndex={0} onBlur={onBlur}>
      <div className="relative">
        <Input
          className="pl-10"
          placeholder={t('assetselector:search-placeholder')}
          value={searchInput}
          onChange={onSearchInputChange}
          onFocus={onFocus}
          ref={inputRef}
        />
        <Search className="absolute top-2 left-2 text-foreground/50" />
        <div
          className={cn(
            'absolute z-10 w-full h-96 top-12 bg-background rounded-lg border-2 border-border overflow-hidden',
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
            !open && 'hidden',
          )}
          style={{ maxHeight: `${popoverMaxHeight}px` }}
        >
          <ScrollArea
            className="h-full w-full pr-2"
            style={{ maxHeight: `${popoverMaxHeight}px` }}
          >
            <div className="grid grid-cols-1">
              {assetSummaries.map((item) => {
                if (hiddenAssetIds.includes(item.id)) {
                  return null
                }

                if (!isMatchedToSearch(item.id)) {
                  return null
                }

                return (
                  <AssetCardListStyle
                    key={item.id}
                    asset={item}
                    className="bg-background rounded-none border-x-0"
                    resolveImageAbsolutePath={resolveImageAbsolutePath}
                  >
                    <Button
                      className="size-10"
                      onClick={() => addAndClose(item.id)}
                    >
                      <PlusCircle />
                    </Button>
                  </AssetCardListStyle>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
