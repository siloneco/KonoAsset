import { AssetFilterCriteria } from './AssetFilterContext'

export const DEFAULT_CRITERIA: AssetFilterCriteria = {
  queryTextMode: 'general',
  generalQueryTextFilter: '',
  queryTextFilterForName: '',
  queryTextFilterForCreator: '',
  assetType: 'All',
  categoryFilter: [],
  tagFilter: [],
  tagFilterMatchType: 'OR',
  supportedAvatarFilter: [],
  supportedAvatarFilterMatchType: 'OR',
}
