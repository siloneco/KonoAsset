import { MatchType } from '@/lib/index.types'

type Props = {
  matchType?: MatchType
  setMatchType?: (matchType: MatchType) => void
}

type ReturnProps = {
  onMatchTypeClicked: () => void
}

export const useMultiFilterItemSelector = ({
  matchType,
  setMatchType,
}: Props): ReturnProps => {
  const toggleMatchType = (matchType: MatchType) => {
    if (matchType === 'OR') {
      return 'AND'
    } else if (matchType === 'AND') {
      return 'Unfilled'
    } else {
      return 'OR'
    }
  }

  const onMatchTypeClicked = () => {
    if (setMatchType !== undefined && matchType !== undefined) {
      setMatchType(toggleMatchType(matchType))
    }
  }

  return {
    onMatchTypeClicked,
  }
}
