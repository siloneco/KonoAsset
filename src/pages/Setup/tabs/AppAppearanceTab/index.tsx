import { PreferenceContext } from '@/components/context/PreferenceContext'
import { LanguageSelector } from '@/components/model-legacy/preference/LanguageSelector'
import { ThemeSelector } from '@/components/model-legacy/preference/ThemeSelector'
import { FC, useContext } from 'react'

export const AppAppearanceTab: FC = () => {
  const { preference, setPreference } = useContext(PreferenceContext)

  return (
    <div className="w-full h-80 flex flex-col justify-center items-center">
      <div className="flex flex-row space-x-2 items-end w-full mt-8 px-8">
        <div className="w-full max-w-[550px] mx-auto space-y-8">
          <LanguageSelector
            language={preference.language}
            setLanguage={async (lang) => {
              setPreference({ ...preference, language: lang }, true)
            }}
          />
          <ThemeSelector
            theme={preference.theme}
            setTheme={async (theme) => {
              setPreference({ ...preference, theme: theme }, true)
            }}
          />
        </div>
      </div>
    </div>
  )
}
