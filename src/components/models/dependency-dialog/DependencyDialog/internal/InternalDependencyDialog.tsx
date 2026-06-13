import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { AssetSummary } from '@/lib/bindings'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { FC } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocalization } from '@/hooks/use-localization'
import { SlimAssetDetail } from '@/components/model-legacy/SlimAssetDetail'
import { AssetCardOpenButton } from '@/components/model-legacy/action-buttons/AssetCardOpenButton'

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void

  loading: boolean

  name: string
  dependencies: AssetSummary[]
}

export const InternalDependencyDialog: FC<Props> = ({
  isOpen,
  setOpen,
  loading,
  name,
  dependencies,
}) => {
  const { t } = useLocalization()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dependencydialog:header')}</DialogTitle>
          {loading && <Skeleton className="w-52 h-3 rounded-full" />}
          <DialogDescription className="grid grid-cols-1 w-full truncate overflow-hidden">
            {!loading && <span className="truncate w-full">{name}</span>}
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="w-full space-y-2">
            <Skeleton className="w-full h-14 rounded-lg" />
          </div>
        )}
        {!loading && (
          <ScrollArea className="max-h-96 pr-2">
            <div className="grid grid-cols-1 w-full space-y-2">
              {dependencies.map((item) => (
                <SlimAssetDetail key={item.id} asset={item} className="w-full">
                  <AssetCardOpenButton
                    id={item.id}
                    displayOpenButtonText
                    hasDependencies={item.dependencies.length > 0}
                  />
                </SlimAssetDetail>
              ))}
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="mx-auto">
              {t('general:button:close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
