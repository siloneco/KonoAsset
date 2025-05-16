import { FC, useContext, useState } from 'react'

import { Separator } from '@/components/ui/separator'
import { SetupProgressContent } from './components/SetupProgressContent'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DataPathSelector } from './tabs/DataPathSelector'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { commands } from '@/lib/bindings'
import { useToast } from '@/hooks/use-toast'
import { OtherPreferenceSelector } from './tabs/OtherPreferenceSelector'
import { useNavigate } from '@tanstack/react-router'
import { AppAppearanceTab } from './tabs/AppAppearanceTab'
import { useLocalization } from '@/hooks/use-localization'

export const SetupPage: FC = () => {
  const { t } = useLocalization()

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
    <div className="h-screen w-screen flex flex-col items-center justify-center px-10 bg-slate-100 dark:bg-background">
      <div className="w-full max-w-[1000px] mx-10 p-6 bg-card rounded-2xl border-2 border-accent">
        <h1 className="flex justify-center items-center text-2xl">
          {t('setup:welcome')}
        </h1>
        <div className="flex flex-row my-4">
          <div className="w-60 h-96 pt-8 space-y-6">
            <SetupProgressContent index={1} currentIndex={tabIndex}>
              {t('setup:sidebar:1')}
            </SetupProgressContent>
            <SetupProgressContent index={2} currentIndex={tabIndex}>
              {t('setup:sidebar:2')}
            </SetupProgressContent>
            <SetupProgressContent index={3} currentIndex={tabIndex}>
              {t('setup:sidebar:3')}
            </SetupProgressContent>
          </div>
          <div className="h-96">
            <Separator orientation="vertical" />
          </div>
          <div className="flex grow flex-col">
            <Tabs value={tabIndex + ''} className="h-96">
              <TabsContent value="1">
                <AppAppearanceTab />
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
                        title: t(
                          'preference:settings:destination-select:error-toast',
                        ),
                        description: result.error,
                      })
                    }
                  }}
                />
              </TabsContent>
              <TabsContent value="3">
                <OtherPreferenceSelector />
              </TabsContent>
            </Tabs>
            <div className="flex w-full max-w-[600px] px-12 mx-auto">
              {tabIndex > 1 && (
                <Button
                  onClick={() => setTabIndex(tabIndex - 1)}
                  variant="outline"
                >
                  {t('general:button:back')}
                </Button>
              )}
              {tabIndex < 3 && (
                <Button
                  onClick={() => setTabIndex(tabIndex + 1)}
                  className="ml-auto"
                >
                  {t('general:button:next')}
                </Button>
              )}
              {tabIndex >= 3 && (
                <Button className="ml-auto" onClick={onLastButtonClicked}>
                  {t('setup:button:done')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
