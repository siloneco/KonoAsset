import { FC, useEffect, useRef } from 'react'
import { GeneralTextSearch } from './components/GeneralTextSearch'
import { AdvancedTextSearch } from './components/AdvancedTextSearch'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

export const TextSearch: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const filters = useAssetFilterStore((state) => state.filters)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'f' && inputRef.current) {
        inputRef.current.focus()
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (filters.text.mode === 'advanced') {
    return <AdvancedTextSearch ref={inputRef} />
  }

  //  mode === 'general' のとき
  return <GeneralTextSearch ref={inputRef} />
}
