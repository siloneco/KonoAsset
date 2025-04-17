import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLocalization } from '@/hooks/use-localization'
import { BadgeAlert, BadgeCheck, FileWarning, Info } from 'lucide-react'

type Props = {
  existingPaths: string[]
  nonExistingPaths: string[]
  submit: () => void
  back: () => void
}

export const PathConfirmationTab = ({
  existingPaths,
  nonExistingPaths,
  submit,
  back,
}: Props) => {
  const { t } = useLocalization()

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex flex-row items-center">
          <FileWarning className="mr-2 text-primary" />
          {t('addasset:path-confirmation:title')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:path-confirmation:description')}
        </DialogDescription>
      </DialogHeader>
      <Alert className="mt-8 w-full border-primary">
        <Info className="h-4 w-4" />
        <AlertTitle className="font-normal">
          {t('addasset:path-confirmation:alert-title')}
        </AlertTitle>
      </Alert>
      <div className="my-8 space-y-6">
        <div>
          <div className="text-lg font-medium mb-2 flex flex-row items-center">
            <BadgeCheck className="mr-1 text-primary" />
            {t('addasset:path-confirmation:import-items')} (
            {existingPaths.length})
          </div>
          {existingPaths.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {existingPaths.map((path, index) => (
                <li key={index} className="text-sm">
                  {path}
                </li>
              ))}
            </ul>
          )}
          {existingPaths.length === 0 && (
            <p>{t('addasset:path-confirmation:none')}</p>
          )}
        </div>
        <div>
          <div className="text-lg font-medium mb-2 flex flex-row items-center">
            <BadgeAlert className="mr-1 text-primary" />
            {t('addasset:path-confirmation:skip-items')} (
            {nonExistingPaths.length})
          </div>
          {nonExistingPaths.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {nonExistingPaths.map((path, index) => (
                <li key={index} className="text-sm">
                  {path}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DialogFooter className="mt-8">
        <Button variant="outline" className="mr-auto" onClick={back}>
          {t('general:button:back')}
        </Button>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <Button
                className="ml-auto"
                onClick={submit}
                disabled={existingPaths.length === 0}
              >
                {t('addasset:path-confirmation:continue-button')}
              </Button>
            </TooltipTrigger>
            {existingPaths.length === 0 && (
              <TooltipContent>
                <p>{t('addasset:path-confirmation:unable-to-continue')}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </DialogFooter>
    </>
  )
}
