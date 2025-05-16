import { Skeleton } from '@/components/ui/skeleton'
import { AssetType, commands } from '@/lib/bindings'
import { convertFileSrc } from '@tauri-apps/api/core'
import { FC, useEffect, useState } from 'react'

const ALT = 'Asset Image'

const getDefaultImage = (assetType: AssetType) => {
  switch (assetType) {
    case 'Avatar':
      return '/no-image/Avatar.png'
    case 'AvatarWearable':
      return '/no-image/AvatarWearable.png'
    case 'WorldObject':
      return '/no-image/WorldObject.png'
  }
}

type Props = {
  filename?: string
  assetType: AssetType
  onError?: () => void
}

export const DisplayPanel: FC<Props> = ({ filename, assetType, onError }) => {
  const [fixedPath, setFixedPath] = useState<string | undefined>(undefined)

  const defaultImagePath = getDefaultImage(assetType)

  const getAbsolutePathAndSet = async () => {
    if (filename === undefined || filename.length == 0) {
      return
    }

    const absolutePath = await commands.getImageAbsolutePath(filename)
    if (absolutePath.status === 'ok') {
      setFixedPath(absolutePath.data)
    } else {
      console.error(absolutePath.error)
    }
  }

  useEffect(() => {
    getAbsolutePathAndSet()
  }, [filename])

  if (fixedPath !== undefined) {
    return (
      <div className="bg-white w-full h-full flex items-center">
        <img
          src={convertFileSrc(fixedPath)}
          alt={ALT}
          className="w-full bg-white"
          onError={onError}
        />
      </div>
    )
  }

  if (filename !== undefined && fixedPath === undefined) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <div className="bg-white">
      <img src={defaultImagePath} alt={ALT} className="opacity-60 w-full" />
    </div>
  )
}
