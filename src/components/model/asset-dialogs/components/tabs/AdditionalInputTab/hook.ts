import { PreferenceContext } from '@/components/context/PreferenceContext'
import { AssetFormType } from '@/lib/form'
import { useContext } from 'react'

export type Props = {
  form: AssetFormType
}

type ReturnProps = {
  memo: string | null
  setMemo: (memo: string | null) => void
  deleteSourceChecked: boolean
  setDeleteSourceChecked: (checked: boolean) => void
}

export const useAdditionalInputTab = ({ form }: Props): ReturnProps => {
  const { preference, setPreference } = useContext(PreferenceContext)

  const setMemo = (memo: string | null) => {
    if (memo === null || memo.length === 0) {
      form.setValue('memo', null)
      return
    }

    form.setValue('memo', memo)
  }

  return {
    memo: form.watch('memo'),
    setMemo,
    deleteSourceChecked: preference.deleteOnImport,
    setDeleteSourceChecked: (checked: boolean) =>
      setPreference({ ...preference, deleteOnImport: checked }, true),
  }
}
