import { DisplayStyle } from '@/lib/bindings'

const SMALL_CARD_WIDTH = 160
const MEDIUM_CARD_WIDTH = 200
const LARGE_CARD_WIDTH = 260

export const calculateColumnCount = (
  width: number,
  size: Omit<DisplayStyle, 'List'>,
) => {
  if (size === 'GridSmall') {
    return Math.floor(width / SMALL_CARD_WIDTH)
  } else if (size === 'GridMedium') {
    return Math.floor(width / MEDIUM_CARD_WIDTH)
  } else if (size === 'GridLarge') {
    return Math.floor(width / LARGE_CARD_WIDTH)
  }

  // default
  return Math.floor(width / MEDIUM_CARD_WIDTH)
}
