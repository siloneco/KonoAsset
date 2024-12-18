import { convertFileSrc } from '@tauri-apps/api/core'

type Props = {
  src?: string
}

const ALT = 'Asset Image'

const ImageWrapper = ({ src }: Props) => {
  if (src === undefined || src === '') {
    return <div className="w-full h-full bg-slate-400"></div>
  }

  if (src.startsWith('https://')) {
    return <img src={src} alt={ALT} />
  }

  return <img src={convertFileSrc(src)} alt={ALT} />
}

export default ImageWrapper
