import { MatchType } from '@/lib/entity'

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
    return matchType === MatchType.AND ? MatchType.OR : MatchType.AND
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
