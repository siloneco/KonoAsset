import { PreferenceContext } from '@/components/context/PreferenceContext'
import { PreferenceTabIDs } from '@/components/page/Preference/hook'

import { TabsContent } from '@/components/ui/tabs'
import { commands, Theme } from '@/lib/bindings'
import { FC, useContext } from 'react'
import ThemeSelector from './components/ThemeSelector'
import DataDirSelector from './components/DataDirSelector'
import DeleteSourceToggle from './components/DeleteSourceToggle'
import UseUnitypackageSelectorToggle from './components/UseUnitypackageSelectorToggle'

type Props = {
  id: PreferenceTabIDs
}

const SettingsTab: FC<Props> = ({ id }) => {
  const { preference, setPreference } = useContext(PreferenceContext)

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
          setDataDir={async (dataDir: string, migrateData: boolean) => {
            const result = await commands.migrateDataDir(dataDir, migrateData)

            if (result.status === 'error') {
              console.error(result.error)
              return result
            }

            // 上の migrateDataDir コマンドで変更が保存されるため保存はしない
            await setPreference({ ...preference, dataDirPath: dataDir }, false)

            return { status: 'ok', data: result.data }
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
      </div>
    </TabsContent>
  )
}

export default SettingsTab
