import {
  FEATURE_BADGE_I18N_KEY,
  FIX_BADGE_I18N_KEY,
  OTHER_BADGE_I18N_KEY,
} from './index.constants'

export const getChangelogBadgeLocalizationKey = (
  variant: 'features' | 'fixes' | 'others' | null | undefined,
) => {
  switch (variant) {
    case 'features':
      return FEATURE_BADGE_I18N_KEY
    case 'fixes':
      return FIX_BADGE_I18N_KEY
    case 'others':
      return OTHER_BADGE_I18N_KEY
  }

  // fallback
  return OTHER_BADGE_I18N_KEY
}
