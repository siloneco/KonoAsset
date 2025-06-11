import { PreferenceContext } from '@/components/context/PreferenceContext'
import { PreferenceTabIDs } from '@/components/page/Preference/hook'

import { TabsContent } from '@/components/ui/tabs'
import { Theme, UpdateChannel } from '@/lib/bindings'
import { FC, useContext } from 'react'
import { DataDirSelector } from './components/DataDirSelector'
import { ResetButton } from './components/ResetButton'
import { Separator } from '@/components/ui/separator'
import { ThemeSelector } from '@/components/model/preference/ThemeSelector'
import { UseUnitypackageSelectorToggle } from '@/components/model/preference/UseUnitypackageSelectorToggle'
import { DeleteSourceToggle } from '@/components/model/preference/DeleteSourceToggle'
import { LanguageSelector } from '@/components/model/preference/LanguageSelector'
import { UpdateChannelSelector } from '@/components/model/preference/UpdateChannelSelector'
import { open } from '@tauri-apps/plugin-dialog'
import { LocalizationContext } from '@/components/context/LocalizationContext'
import { ZipExtractionToggle } from '@/components/model/preference/ZipExtractionToggle'

type Props = {
  id: PreferenceTabIDs
}

export const SettingsTab: FC<Props> = ({ id }) => {
  const { preference, setPreference } = useContext(PreferenceContext)
  const { data, loadBundledLanguageFile, loadLanguageFile } =
    useContext(LocalizationContext)

  const selectFileAndLoadLanguageFile = async () => {
    const path = await open({
      multiple: false,
      filters: [{ extensions: ['json'], name: 'JSON' }],
    })

    if (path === null) {
      return
    }

    await loadLanguageFile(path)
  }

  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="mt-0 w-full px-12 py-8 space-y-8">
        <ThemeSelector
          theme={preference.theme}
          setTheme={async (theme: Theme) => {
            await setPreference({ ...preference, theme }, true)
          }}
        />
        <DataDirSelector
          dataDir={preference.dataDirPath}
          updateLocalDataDir={async (dataDir: string) => {
            await setPreference({ ...preference, dataDirPath: dataDir }, false)
          }}
        />
        <UseUnitypackageSelectorToggle
          enable={preference.useUnitypackageSelectedOpen}
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                useUnitypackageSelectedOpen: enable,
              },
              true,
            )
          }}
        />
        <DeleteSourceToggle
          enable={preference.deleteOnImport}
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                deleteOnImport: enable,
              },
              true,
            )
          }}
        />
        <ZipExtractionToggle
          enable={preference.zipExtraction}
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                zipExtraction: enable,
              },
              true,
            )
          }}
        />
        <Separator />
        <LanguageSelector
          language={data.language}
          setLanguage={async (language) => {
            await loadBundledLanguageFile(language)
            await setPreference({ ...preference, language }, true)
          }}
          loadLanguageFile={selectFileAndLoadLanguageFile}
        />
        <UpdateChannelSelector
          updateChannel={preference.updateChannel}
          setUpdateChannel={async (channel: UpdateChannel) => {
            await setPreference({ ...preference, updateChannel: channel }, true)
          }}
        />
        <ResetButton />
      </div>
    </TabsContent>
  )
}
