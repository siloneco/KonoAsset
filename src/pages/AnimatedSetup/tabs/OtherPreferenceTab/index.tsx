import { PreferenceContext } from '@/components/context/PreferenceContext'
import { DeleteSourceToggle } from '@/components/model-legacy/preference/DeleteSourceToggle'
import { UpdateChannelSelector } from '@/components/model-legacy/preference/UpdateChannelSelector'
import { UseUnitypackageSelectorToggle } from '@/components/model-legacy/preference/UseUnitypackageSelectorToggle'
import { ZipExtractionToggle } from '@/components/model-legacy/preference/ZipExtractionToggle'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLocalization } from '@/hooks/use-localization'
import { useNavigate } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { FC, useCallback, useContext } from 'react'

type Props = {
  previousTab: () => void
}

export const OtherPreferenceTab: FC<Props> = ({ previousTab }) => {
  const { t } = useLocalization()
  const navigate = useNavigate()

  const { preference, setPreference } = useContext(PreferenceContext)

  const onStartButtonClick = useCallback(async () => {
    // preference.json が無い場合フォールバックされてしまうため、セーブする
    await setPreference(preference, true)

    const viewTransition = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? undefined
      : { types: ['setup-to-main'] }

    navigate({ to: '/', viewTransition })
  }, [preference, setPreference, navigate])

  return (
    <div className="size-full flex flex-col gap-2">
      <div className="grid size-full shrink overflow-hidden">
        <ScrollArea type="always" className="max-h-75">
          <div className="grid gap-8 size-full mx-auto pr-6">
            <UpdateChannelSelector
              updateChannel={preference.updateChannel}
              setUpdateChannel={async (channel) => {
                await setPreference(
                  { ...preference, updateChannel: channel },
                  true,
                )
              }}
            />
            <DeleteSourceToggle
              enable={preference.deleteOnImport}
              setEnable={async (deleteOnImport) => {
                await setPreference({ ...preference, deleteOnImport }, true)
              }}
            />
            <UseUnitypackageSelectorToggle
              enable={preference.useUnitypackageSelectedOpen}
              setEnable={async (enable) => {
                await setPreference(
                  { ...preference, useUnitypackageSelectedOpen: enable },
                  true,
                )
              }}
            />
            <ZipExtractionToggle
              enable={preference.zipExtraction}
              setEnable={async (enable) => {
                await setPreference(
                  { ...preference, zipExtraction: enable },
                  true,
                )
              }}
            />
          </div>
        </ScrollArea>
      </div>
      <div className="w-full shrink-0">
        <CardFooter className="w-full flex justify-between px-0">
          <Button variant="outline" onClick={previousTab}>
            {t('general:button:back')}
          </Button>
          <Button onClick={onStartButtonClick}>
            <Play />
            {t('setup:button:done')}
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}
