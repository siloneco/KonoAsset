import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { MemoDialogContentsConstructor } from '../../MemoDialogContentsConstructor'

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void

  loading: boolean

  name: string
  memo: string
}

export const InternalMemoDialog: FC<Props> = ({
  isOpen,
  setOpen,
  loading,
  name,
  memo,
}) => {
  const { t } = useLocalization()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('general:memo')}</DialogTitle>
          {loading && <Skeleton className="w-52 h-3 rounded-full" />}
          <DialogDescription className="max-w-[450px] truncate">
            {!loading && name}
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="w-full space-y-2">
            <Skeleton className="w-40 h-4 rounded-full" />
            <Skeleton className="w-64 h-4 rounded-full" />
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-96 h-4 rounded-full" />
          </div>
        )}
        {!loading && (
          <ScrollArea className="max-h-96 pr-4 w-full" type="always">
            <div className="grid grid-cols-1 w-full">
              <MemoDialogContentsConstructor>
                {memo}
              </MemoDialogContentsConstructor>
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
