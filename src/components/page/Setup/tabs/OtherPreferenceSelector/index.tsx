import { PreferenceContext } from '@/components/context/PreferenceContext'
import DeleteSourceToggle from '@/components/model/preference/DeleteSourceToggle'
import UpdateChannelSelector from '@/components/model/preference/UpdateChannelSelector'
import UseUnitypackageSelectorToggle from '@/components/model/preference/UseUnitypackageSelectorToggle'

import { FC, useContext } from 'react'

export const OtherPreferenceSelector: FC = () => {
  const { preference, setPreference } = useContext(PreferenceContext)

  return (
    <div className="w-full h-80 flex flex-col justify-center items-center">
      <div className="flex flex-row space-x-2 items-end w-full mt-8 px-8">
        <div className="w-full max-w-[550px] mx-auto space-y-8">
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
        </div>
      </div>
    </div>
  )
}
