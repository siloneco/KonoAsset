import { AssetFilters } from '.'

export const DEFAULT_FILTERS: AssetFilters = {
  text: {
    mode: 'general',
    generalQuery: '',
    advancedNameQuery: '',
    advancedCreatorQuery: '',
  },
  assetType: 'All',
  category: [],
  tag: {
    type: 'OR',
    filters: [],
  },
  supportedAvatar: {
    type: 'OR',
    filters: [],
  },
}
