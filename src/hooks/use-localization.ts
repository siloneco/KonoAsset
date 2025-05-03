import { LocalizationContext } from '@/components/context/LocalizationContext'
import { useContext } from 'react'

import enUs from '@/locales/en-US.json'

type ReturnProps = {
  t: (id: string) => string
}

const fallback: { [x: string]: string } = enUs['data']

export const useLocalization = (): ReturnProps => {
  const { data } = useContext(LocalizationContext)

  const t = (id: string): string => {
    const value = data.data[id] ?? fallback[id]

    if (value === undefined) {
      console.error(`Missing localization key: ${id}`)
      return id
    }

    return value
  }

  return { t }
}
