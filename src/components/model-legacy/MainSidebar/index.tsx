import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { TypeSelector } from './components/TypeSelector'
import { AvatarWearableFilter } from './layout/AvatarWearableFilter'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { WorldObjectFilter } from './layout/WorldObjectFilter'
import { MultiFilterItemSelector } from '@/components/model-legacy/MainSidebar/components/MultiFilterItemSelector'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from '@tanstack/react-router'
import { Route as PreferenceRoute } from '@/routes/preference'
import { TextSearch } from './components/TextSearch'
import { useLocalization } from '@/hooks/use-localization'
import { AllTypeFilter } from './layout/AllTypeFilter'
import { useMainSidebar } from './hook'
import { OtherAssetFilter } from './layout/OtherAssetFilter'
import { FC } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

export const MainSidebar: FC = () => {
  const { tagCandidates, tagSelectorInputProps } = useMainSidebar()

  const navigate = useNavigate()
  const { t } = useLocalization()
  const { filters, updateFilter } = useAssetFilterStore(
    useShallow((state) => ({
      filters: state.filters,
      updateFilter: state.updateFilter,
    })),
  )

  return (
    <Sidebar
      collapsible="none"
      className="w-64 border-r-2 [view-transition-name:sidebar]"
    >
      <SidebarContent className="w-64">
        <ScrollArea className="h-screen">
          <div className="flex flex-row items-center m-4 mr-0">
            <img src="/logo.png" alt="logo" className="w-10 h-10 select-none" />
            <div className="text-xl ml-2">KonoAsset</div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto mr-4 flex relative"
              onClick={() => {
                const viewTransition = window.matchMedia(
                  '(prefers-reduced-motion: reduce)',
                ).matches
                  ? undefined
                  : { types: ['default-transition'] }

                navigate({
                  to: PreferenceRoute.to,
                  viewTransition,
                })
              }}
            >
              <Settings />
            </Button>
          </div>
          <SidebarGroup>
            <SidebarGroupContent className="p-2">
              <TextSearch />
              <Label className="text-base">{t('mainsidebar:asset-type')}</Label>
              <TypeSelector />
              {filters.assetType === 'All' && <AllTypeFilter />}
              {filters.assetType === 'AvatarWearable' && (
                <AvatarWearableFilter />
              )}
              {filters.assetType === 'WorldObject' && <WorldObjectFilter />}
              {filters.assetType === 'OtherAsset' && <OtherAssetFilter />}
              <div className="mt-4">
                <MultiFilterItemSelector
                  label={t('general:tag')}
                  placeholder={t('mainsidebar:filter:tag:placeholder')}
                  candidates={tagCandidates}
                  value={filters.tag.filters}
                  onValueChange={(value) =>
                    updateFilter({
                      tag: {
                        filters: value,
                      },
                    })
                  }
                  matchType={filters.tag.type}
                  setMatchType={(type) => updateFilter({ tag: { type } })}
                  inputProps={tagSelectorInputProps}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
