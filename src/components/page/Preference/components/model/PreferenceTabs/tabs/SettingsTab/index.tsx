import { PreferenceContext } from '@/components/context/PreferenceContext'
import { PreferenceTabIDs } from '@/components/page/Preference/hook'

import { TabsContent } from '@/components/ui/tabs'
import { commands, Theme } from '@/lib/bindings'
import { FC, useContext } from 'react'
import ThemeSelector from './components/ThemeSelector'
import DataDirSelector from './components/DataDirSelector'
import SkipUnitypackageSelectorToggle from './components/SkipUnitypackageSelectorToggle'
import DeleteSourceToggle from './components/DeleteSourceToggle'

type Props = {
  id: PreferenceTabIDs
}

const SettingsTab: FC<Props> = ({ id }) => {
  const { preference, setPreference } = useContext(PreferenceContext)

  return (
    <TabsContent value={id} className="w-full">
      <div className="w-full px-12 py-8 space-y-8">
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

            return { status: 'ok', data: null }
          }}
        />
        <SkipUnitypackageSelectorToggle
          enable={
            preference.skipConfirmation
              .openManagedDirOnMultipleUnitypackageFound
          }
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                skipConfirmation: {
                  ...preference.skipConfirmation,
                  openManagedDirOnMultipleUnitypackageFound: enable,
                },
              },
              true,
            )
          }}
        />
        <DeleteSourceToggle
          enable={preference.skipConfirmation.deleteFileOrDirOnImport}
          setEnable={async (enable: boolean) => {
            await setPreference(
              {
                ...preference,
                skipConfirmation: {
                  ...preference.skipConfirmation,
                  deleteFileOrDirOnImport: enable,
                },
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
