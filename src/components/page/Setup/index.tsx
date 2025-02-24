import { FC, useContext, useState } from 'react'

import LoadErrorPage from '../LoadError'
import { Separator } from '@/components/ui/separator'
import { SetupProgressContent } from './components/SetupProgressContent'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { LanguageTab } from './tabs/LanguageTab'
import { Button } from '@/components/ui/button'
import { DataPathSelector } from './tabs/DataPathSelector'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { commands } from '@/lib/bindings'
import { useToast } from '@/hooks/use-toast'
import { OtherPreferenceSelector } from './tabs/OtherPreferenceSelector'
import { useNavigate } from '@tanstack/react-router'

export const SetupPage: FC = () => {
  const [tabIndex, setTabIndex] = useState(1)
  const { toast } = useToast()
  const navigate = useNavigate()

  const { preference, setPreference } = useContext(PreferenceContext)

  const onLastButtonClicked = async () => {
    // preference.json が無い場合フォールバックされてしまうため、セーブする
    await setPreference(preference, true)
    navigate({ to: '/' })
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center px-10">
      <div className="w-full max-w-[1000px] mx-10 p-6 bg-card rounded-2xl border-2 border-accent">
        <h1 className="flex justify-center items-center text-2xl">
          KonoAssetへようこそ！ / Welcome to KonoAsset!
        </h1>
        <div className="flex flex-row my-4">
          <div className="w-60 h-96 pt-8 space-y-6">
            <SetupProgressContent index={1} currentIndex={tabIndex}>
              言語 / Language
            </SetupProgressContent>
            <SetupProgressContent index={2} currentIndex={tabIndex}>
              保存場所の選択
            </SetupProgressContent>
            <SetupProgressContent index={3} currentIndex={tabIndex}>
              その他の設定
            </SetupProgressContent>
          </div>
          <Separator orientation="vertical" className="h-96" />
          <div className="flex flex-grow flex-col">
            <Tabs value={tabIndex + ''} className="h-80">
              <TabsContent value="1">
                <LanguageTab />
              </TabsContent>
              <TabsContent value="2">
                <DataPathSelector
                  path={preference.dataDirPath}
                  setPath={async (path) => {
                    const result = await commands.migrateDataDir(path, false)
                    if (result.status === 'ok') {
                      setPreference({ ...preference, dataDirPath: path }, false)
                    } else {
                      console.error(result.error)
                      toast({
                        title: 'エラー: データディレクトリの変更に失敗しました',
                        description: result.error,
                      })
                    }
                  }}
                />
              </TabsContent>
              <TabsContent value="3">
                <OtherPreferenceSelector
                  theme={preference.theme}
                  setTheme={async (theme) => {
                    setPreference({ ...preference, theme: theme }, true)
                  }}
                  updateChannel={preference.updateChannel}
                  setUpdateChannel={async (updateChannel) => {
                    setPreference(
                      { ...preference, updateChannel: updateChannel },
                      true,
                    )
                  }}
                />
              </TabsContent>
            </Tabs>
            <div className="flex w-full max-w-[600px] px-12 mx-auto">
              {tabIndex > 1 && (
                <Button
                  onClick={() => setTabIndex(tabIndex - 1)}
                  variant="outline"
                >
                  戻る
                </Button>
              )}
              {tabIndex < 3 && (
                <Button
                  onClick={() => setTabIndex(tabIndex + 1)}
                  className="ml-auto"
                >
                  次へ
                </Button>
              )}
              {tabIndex >= 3 && (
                <Button className="ml-auto" onClick={onLastButtonClicked}>
                  利用をはじめる！
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadErrorPage
