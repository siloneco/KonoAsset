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
import { MultiFilterItemSelector } from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from '@tanstack/react-router'
import { Route as PreferenceRoute } from '@/routes/preference'
import { TextSearch } from './components/TextSearch'
import { useLocalization } from '@/hooks/use-localization'
import { AllTypeFilter } from './layout/AllTypeFilter'
import { useMainSidebar } from './hook'

export const MainSidebar = () => {
  const {
    textSearchMode,
    setTextSearchMode,
    generalQueryTextFilter,
    setGeneralQueryTextFilter,
    queryTextFilterForName,
    setQueryTextFilterForName,
    queryTextFilterForCreator,
    setQueryTextFilterForCreator,

    filteredAssetType,

    tagCandidates,
    tagValues,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,
    tagSelectorInputProps,
  } = useMainSidebar()

  const navigate = useNavigate()
  const { t } = useLocalization()

  return (
    <Sidebar collapsible="none" className="w-64 border-r-2">
      <SidebarContent className="w-64">
        <ScrollArea className="h-screen">
          <div className="flex flex-row items-center m-4 mr-0">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />
            <div className="text-xl ml-2">KonoAsset</div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto mr-4 flex relative"
              onClick={() => navigate({ to: PreferenceRoute.to })}
            >
              <Settings />
            </Button>
          </div>
          <SidebarGroup>
            <SidebarGroupContent className="p-2">
              <TextSearch
                mode={textSearchMode}
                setMode={setTextSearchMode}
                general={generalQueryTextFilter}
                setGeneral={setGeneralQueryTextFilter}
                name={queryTextFilterForName}
                setName={setQueryTextFilterForName}
                creator={queryTextFilterForCreator}
                setCreator={setQueryTextFilterForCreator}
              />
              <Label className="text-base">{t('mainsidebar:asset-type')}</Label>
              <TypeSelector />
              {filteredAssetType === 'All' && <AllTypeFilter />}
              {filteredAssetType === 'AvatarWearable' && (
                <AvatarWearableFilter />
              )}
              {filteredAssetType === 'WorldObject' && <WorldObjectFilter />}
              <div className="mt-4">
                <MultiFilterItemSelector
                  label={t('general:tag')}
                  placeholder={t('mainsidebar:filter:tag:placeholder')}
                  candidates={tagCandidates}
                  value={tagValues}
                  onValueChange={(values) =>
                    setTagFilter(values.map((v) => v.value))
                  }
                  matchType={tagFilterMatchType}
                  setMatchType={setTagFilterMatchType}
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
