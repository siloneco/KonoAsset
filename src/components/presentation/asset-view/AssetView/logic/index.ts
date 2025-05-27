import { AssetCardSize } from '@/components/context/PersistentContext'

const SMALL_CARD_WIDTH = 160
const MEDIUM_CARD_WIDTH = 200
const LARGE_CARD_WIDTH = 260

export const calculateColumnCount = (
  width: number,
  size: Omit<AssetCardSize, 'List'>,
) => {
  if (size === 'Small') {
    return Math.floor(width / SMALL_CARD_WIDTH)
  } else if (size === 'Medium') {
    return Math.floor(width / MEDIUM_CARD_WIDTH)
  } else if (size === 'Large') {
    return Math.floor(width / LARGE_CARD_WIDTH)
  }

  // default
  return Math.floor(width / MEDIUM_CARD_WIDTH)
}
