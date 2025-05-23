import { commands, FileInfo } from '@/lib/bindings'
import { DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { UnitypackageSelector } from './components/UnitypackageSelector'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useContext, useState } from 'react'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  assetId: string | null
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
  unitypackageFiles: { [x: string]: FileInfo[] }
}

export const SelectUnitypackageDialog = ({
  assetId,
  dialogOpen,
  setDialogOpen,

  unitypackageFiles,
}: Props) => {
  const { preference, setPreference } = useContext(PreferenceContext)
  const [skipDialog, setSkipDialog] = useState(
    !preference.useUnitypackageSelectedOpen,
  )
  const { t } = useLocalization()

  const openManagedDir = async () => {
    if (assetId === null) {
      console.error('Unable to open managed dir without assetId')
      return
    }

    const result = await commands.openManagedDir(assetId)

    if (result.status === 'error') {
      console.error(result.error)
    }
  }

  const setSkipDialogAndSave = async (skipDialog: boolean) => {
    await setPreference(
      { ...preference, useUnitypackageSelectedOpen: !skipDialog },
      true,
    )
    setSkipDialog(skipDialog)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t('assetcard:select-unitypackage:select-file')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4 max-w-[534px]">
            {Object.keys(unitypackageFiles)
              .sort((a, b) => a.localeCompare(b))
              .map((path) => (
                <UnitypackageSelector
                  key={path}
                  path={path}
                  files={unitypackageFiles[path]}
                  closeDialog={() => setDialogOpen(false)}
                />
              ))}
          </div>
        </ScrollArea>
        <div
          className="my-2 w-fit mx-auto flex items-center"
          onClick={() => setSkipDialogAndSave(!skipDialog)}
        >
          <Checkbox checked={skipDialog} className="cursor-pointer" />
          <Label className="ml-2 cursor-pointer">
            {t('assetcard:select-unitypackage:always-open-dir')}
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="mr-auto">
              {t('general:button:close')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={'secondary'} onClick={openManagedDir}>
              {t('assetcard:open-button:open-dir')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
