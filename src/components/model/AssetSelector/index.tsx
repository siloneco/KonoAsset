import { Input } from '@/components/ui/input'
import { AssetSummary } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { PlusCircle, Search } from 'lucide-react'
import { FC } from 'react'
import SlimAssetDetail from '../SlimAssetDetail'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAssetSelector } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  className?: string
  slimAssetDetailClassName?: string

  assets: AssetSummary[]
  ignoredAssetIds: string[]
  onSelected: (assetId: string) => void
}

export const AssetSelector: FC<Props> = ({
  className,
  slimAssetDetailClassName,
  assets,
  ignoredAssetIds,
  onSelected,
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
  } = useAssetSelector({ onSelected })

  return (
    <div className={className} tabIndex={0} onBlur={onBlur}>
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
            'absolute z-10 w-[calc(100%-16px)] h-96 top-12 bg-background rounded-lg mx-2',
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
            !open && 'hidden',
          )}
          style={{ maxHeight: `${popoverMaxHeight}px` }}
        >
          <ScrollArea
            className="h-full w-full pr-2"
            style={{ maxHeight: `${popoverMaxHeight}px` }}
          >
            {assets.map((item) => {
              if (ignoredAssetIds.includes(item.id)) {
                return null
              }

              if (!isMatchedToSearch(item.id)) {
                return null
              }

              return (
                <SlimAssetDetail
                  key={item.id}
                  asset={item}
                  className={cn(
                    'w-full bg-background rounded-none border-x-0',
                    slimAssetDetailClassName,
                  )}
                >
                  <Button
                    className="h-10 w-10"
                    onClick={() => addAndClose(item.id)}
                  >
                    <PlusCircle />
                  </Button>
                </SlimAssetDetail>
              )
            })}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
