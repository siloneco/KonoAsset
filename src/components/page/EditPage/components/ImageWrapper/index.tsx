import { convertFileSrc } from '@tauri-apps/api/core'

type Props = {
  src?: string
}

const ALT = 'Asset Image'

const ImageWrapper = ({ src }: Props) => {
  if (src === undefined || src === '') {
    return <div className="w-full h-full bg-slate-400 rounded-lg"></div>
  }

  if (src.startsWith('https://')) {
    return <img src={src} alt={ALT} className="rounded-lg" />
  }

  return <img src={convertFileSrc(src)} alt={ALT} className="rounded-lg" />
}

export default ImageWrapper
