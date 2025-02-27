import { FC, useEffect, useRef } from 'react'
import GeneralTextSearch from './components/GeneralTextSearch'
import AdvancedTextSearch from './components/AdvancedTextSearch'

type Props = {
  mode: 'general' | 'advanced'
  setMode: (mode: 'general' | 'advanced') => void

  general: string
  setGeneral: (general: string) => void

  name: string
  setName: (name: string) => void
  creator: string
  setCreator: (creator: string) => void
}

const TextSearch: FC<Props> = ({
  mode,
  setMode,
  general,
  setGeneral,
  name,
  setName,
  creator,
  setCreator,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

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

  if (mode === 'advanced') {
    return (
      <AdvancedTextSearch
        onSwitchModeClicked={() => {
          setMode('general')
          setName('')
          setCreator('')
        }}
        name={name}
        setName={setName}
        creator={creator}
        setCreator={setCreator}
        ref={inputRef}
      />
    )
  }

  //  mode === 'general' のとき
  return (
    <GeneralTextSearch
      onSwitchModeClicked={() => {
        setMode('advanced')
        setGeneral('')
      }}
      general={general}
      setGeneral={setGeneral}
      ref={inputRef}
    />
  )
}

export default TextSearch
