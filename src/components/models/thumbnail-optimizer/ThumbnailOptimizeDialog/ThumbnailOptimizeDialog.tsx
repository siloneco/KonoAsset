import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FC } from 'react'
import { useThumbnailOptimizeDialog } from './hook'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useLocalization } from '@/hooks/use-localization'

export const ThumbnailOptimizeDialog: FC = () => {
  const {
    dialogOpen,
    setDialogOpen,
    loading,
    amountOfOptimizableThumbnails,
    amountOfDeletableThumbnails,
    inProgress,
    startOptimization,
    filename,
    progress,
  } = useThumbnailOptimizeDialog()

  const { t } = useLocalization()

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {t('preference:thumbnail-optimizer:button:optimize')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t('preference:thumbnail-optimizer:dialog:title')}
          </DialogTitle>
          <DialogDescription>
            {t('preference:thumbnail-optimizer:dialog:description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Alert className="mb-4 w-fit">
              <AlertTitle className="flex items-center gap-1">
                <AlertCircle className="size-4 text-primary" />
                {t('preference:thumbnail-optimizer:dialog:alert')}
              </AlertTitle>
            </Alert>
            <p className="flex items-center">
              <span className="text-muted-foreground mr-1">
                {t('preference:thumbnail-optimizer:dialog:info:resizables')}
              </span>
              {loading && <Skeleton className="w-10 h-5" />}
              {!loading && (
                <>
                  {amountOfOptimizableThumbnails}{' '}
                  {t('preference:thumbnail-optimizer:dialog:info:unit')}
                </>
              )}
            </p>
            <p className="flex items-center">
              <span className="text-muted-foreground mr-1">
                {t('preference:thumbnail-optimizer:dialog:info:deletables')}
              </span>
              {loading && <Skeleton className="w-10 h-5" />}
              {!loading && (
                <>
                  {amountOfDeletableThumbnails}
                  {t('preference:thumbnail-optimizer:dialog:info:unit')}
                </>
              )}
            </p>
          </div>
          <div className="space-y-1 mb-4">
            <div className="h-5">
              <p className="text-muted-foreground truncate">{filename}</p>
            </div>
            <Progress value={progress * 100} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="mr-auto">
              {t('general:button:cancel')}
            </Button>
          </DialogClose>
          <Button
            disabled={
              loading ||
              inProgress ||
              amountOfDeletableThumbnails + amountOfOptimizableThumbnails === 0
            }
            onClick={startOptimization}
          >
            {inProgress && (
              <>
                <Loader2 className="animate-spin size-4" />
                {t('preference:thumbnail-optimizer:dialog:running')}
              </>
            )}
            {!inProgress && t('preference:thumbnail-optimizer:dialog:start')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
