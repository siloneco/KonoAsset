import { useToast } from '@/hooks/use-toast'
import { Route as TopPageRoute } from '@/routes'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { useLocalization } from '@/hooks/use-localization'

type ReturnProps = {
  version: string
  backToTopPage: () => void
  onVersionClick: () => Promise<void>
}

export const usePreferenceSidebar = (): ReturnProps => {
  const [version, setVersion] = useState('X.X.X')

  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useLocalization()

  const backToTopPage = () => {
    navigate({ to: TopPageRoute.to })
  }

  const onVersionClick = async () => {
    navigator.clipboard.writeText(`v${version}`)

    toast({
      title: t('preference:toast-version-copied'),
      duration: 1500,
    })
  }

  const getVersionAndSet = async () => {
    const v = await getVersion()
    setVersion(v)
  }

  useEffect(() => {
    getVersionAndSet()
  }, [])

  return {
    version,
    backToTopPage,
    onVersionClick,
  }
}
